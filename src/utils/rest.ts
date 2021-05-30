import axios from 'axios';

export const postData = async (url: string, options: any, fallback?: any) => {
  try {
    const result = await axios.post(url, options, { withCredentials: true });
    return result.data;
  } catch (e) {
    console.dir('[Rest-post] Error: ', e);
    fallback();
  }
};

export const getData = async (url: string, fallback?: any) => {
  try {
    const result = await axios.get(url, {
      withCredentials: true,
    });
    return result.data;
  } catch (e) {
    console.dir('[Rest-get] Error: ', e);
    fallback();
  }
};
