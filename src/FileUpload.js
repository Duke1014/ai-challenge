import React from 'react'
import Papa from 'papaparse';

export default function FileUpload({setData}) {

    const handleFileUpload = (e, isInfoFile) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    if (isInfoFile) {
                        setData(result.data);
                    } else {
                        setData(result.data);
                    }
                }
            });
        }
    };

  return (
    <div className='file-uploader'>
        <label>Choose a .csv file: </label>
        <input type="file" onChange={(e) => handleFileUpload(e, true)} />
    </div>
  )
}
