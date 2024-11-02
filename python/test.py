import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import openai
import os

#START OF ai summuray prompt choices and setting up ai
openai.api_key = 'your-api-key-here'

def summarize_trends(df, column1, column2):
   # Prepare the data for the API
   summary_text = df[[column1, column2]].to_string(index=False)
   response = openai.ChatCompletion.create(
   model='gpt-4',
   messages=[
      {"role": "system", "content": "You are an AI that summarizes trends in data."},
      {"role": "user", "content": f"Summarize the trends between these two columns:\n{summary_text}"}
      ]
   )
   return response['choices'][0]['message']['content']

def identify_outliers(df, column):
    # Prepare the data for the API
    outlier_text = df[[column]].to_string(index=False)
    
    response = openai.ChatCompletion.create(
        model='gpt-4',
        messages=[
            {"role": "system", "content": "You are an AI that identifies outliers in data."},
            {"role": "user", "content": f"Identify key outliers in this column:\n{outlier_text}"}
        ]
    )
    
    return response['choices'][0]['message']['content']
#END OF ai summuray prompt choices and setting up ai

#START OF obtaining two .csv's to leverage for insights
user_csv_input1 = input("Please enter first csv: ")
user_csv_input2 = input("Please enter second csv: ")

data_frame_csv1 = pd.read_csv(user_csv_input1)
data_frame_csv2 = pd.read_csv(user_csv_input2)
#END OF obtaining two .csv's to leverage for insights

#START OF user input pruning of data 
prune_bool = input("Would you like to prune data (enter yes or no): ")
if(prune_bool == "yes"):
   print("Please delete any nesseary columns for data set 1")
   user_continue = "yes"
   while(user_continue == "yes"):
      print("Columns for data set1:", data_frame_csv1.columns.tolist())
      column_to_delete = input("which column would you like to prune: ")
      data_frame_csv1 = data_frame_csv1.drop(columns=column_to_delete)
      user_continue = input("is There another column you would like to prune (enter yes or no): ")
      
   print("Please delete any nesseary columns for data set 2")
   user_continue = "yes"
   while(user_continue == "yes"):
      print("Columns for data set1:", data_frame_csv2.columns.tolist())
      column_to_delete = input("which column would you like to prune: ")
      data_frame_csv2 = data_frame_csv2.drop(columns=column_to_delete)
      user_continue = input("is There another column you would like to prune (enter yes or no): ")      
#END OF user input pruning of data 

#START OF data merging 
print("We will now merge the tables")
combined_data_frame = pd.concat([data_frame_csv1, data_frame_csv2], ignore_index = 1)
print("Columns for combined:", combined_data_frame.columns.tolist())
#END OF data merging

#START OF modifying column names
modify_bool = input("Would you like to modify data names(enter yes or no): ")
if(modify_bool == "yes"):
   print("New column names: ", combined_data_frame.columns.tolist())
   new_column_names = {}
   for old_name in combined_data_frame.columns:
      new_name = input(f"Enter new name for '{old_name}' (or press enter to keep it the same): ")
      if new_name:  # Only add to dictionary if a new name is provided
        new_column_names[old_name] = new_name

   combined_data_frame = combined_data_frame.rename(columns=new_column_names)
#END OF modifyinig column names

#START OF prompts to ai to summerize
bool_menu = "yes"
while(bool_menu == "yes"):
   menu_prompt = input("Look at the list below and choose a prompt\n1): summerize trends between two or more sets\n2): note key outliers within one or more data sets\n3): summerize trends between two or more sets\n")
   match menu_prompt:
      case 1:# summerize trends between two columns
         print("Columns for combined:", combined_data_frame.columns.tolist()) 
		 user_column_choice1 = input("what first column would you like to choose: ")
		 user_column_choice2 = input("what second column would you like to choose: ")
		 summarize_trends(combined_data_frame, user_column_choice1, user_column_choice2)
	  case 2:#
	     print("Columns for combined:", combined_data_frame.columns.tolist()) 
		 user_column_choice1 = input("what first column would you like to choose: ")
		 identify_outliers((combined_data_frame, user_column_choice1)
   bool_menu = input("Would you like to make another prompt (yes or no): ")
