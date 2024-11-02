import React from 'react'
import Papa from 'papaparse';

export default function FileUpload({id, setData}) {

    const handleFileUpload = (e, isInfoFile) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    if (isInfoFile) {
                        setData(result.data);
                        console.log(result.data)
                    } else {
                        setData(result.data);
                        console.log(result.data)
                    }
                }
            });
        }
    };

  return (
    <div className='file-uploader'>
        <label>Choose .csv file #{id}: </label>
        <input type="file" onChange={(e) => handleFileUpload(e, true)} />
    </div>
  )
}
