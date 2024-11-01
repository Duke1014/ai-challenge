import React from 'react'
import Papa from 'papaparse';

export default function FileUpload() {

    const handleFileUpload = (e, isInfoFile) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    if (isInfoFile) {
                        // processEmployeeInfo(result.data);
                    } else {
                        // processEmployeePerformance(result.data);
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
