import axios from 'axios'

const downloadFile = ({ url, filename }) => {
  axios.get(url, {
    responseType: 'blob',
  }).then((response) => {
   console.info('downloadFile url:', url)
   const href = window.URL.createObjectURL(new Blob([response.data]));
   const link = document.createElement('a');
   link.href = href;
   link.setAttribute('download', filename); //or any other extension
   document.body.appendChild(link);
   link.click();
   window.URL.revokeObjectURL(url);
   console.info('downloadFile url:', url, 'done.')
  });
}

export { downloadFile }
