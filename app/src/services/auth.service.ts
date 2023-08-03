import jwtDecode from 'jwt-decode';
import axios from 'src/services/axios.service';

class AuthService {
  setAxiosInterceptors = (propx: any) => {
    const { onLogout } = propx;
    const time = `${Date.now()}`.substr(9);

    // Default Axios
    axios.defaults.baseURL = process.env.REACT_APP_API_URL_NEST;
    axios.defaults.timeout = 30000; // 30sec
    axios.defaults.headers.Accept = '*/*';
    axios.defaults.headers['Content-Type'] = 'application/json';
    // axios.defaults.withCredentials = false; // ถ้าใส่ true  แล้วจะติด Access-Control-Allow-Origin

    // On request
    axios.interceptors.request.use((request) => request);

    // On response
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(`RES:${time}`, { status: error?.response?.status || 503, error: `${error}` });
        if (error.response && error.response.status === 401) {
          if (onLogout) {
            // alert(`onLogout - ${error}`);
            onLogout();
          }
        }
        return Promise.reject(error);
      },
    );
  };

  // กำหนด token ที่ axios
  setAuthorization = (accessToken: string) => {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  };

  // ลบ token ออกจาก axios
  delAuthorization = () => {
    delete axios.defaults.headers.common.Authorization;
  };

  // ตรวจสอบ token ว่ามีอยู่จริงและยังไม่หมดอายุ
  isValidToken = (token?: string | null) => {
    if (!token) {
      return false;
    }

    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  };
}

const authService = new AuthService();

export default authService;
