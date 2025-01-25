/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from "axios";
import { store } from "../store/configureStore";
import { router } from "../router/Routes";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../models/pagination";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.interceptors.response.use(
  async (response) => {
    await sleep();
    console.log(response);
    // const pagination=response.headers['pagination'];    //PAGINATION MORA MALIM SLOVIMA
    // if(pagination){
    //     response.data=new PaginatedResponse(response.data, JSON.parse(pagination))
    //     //console.log(response);
    // }
    if (response.status === 201) {
      if (response.data.method == "CreateTheme") toast.success("Tema kreirana");
      if (response.data.method == "CreateCourse") toast.success("Kurs kreiran");

      // Ako želite, možete dodati specifičnu logiku za status 201
    }

    const pagination = response.headers["pagination"];
    //console.log(response.headers);
    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
      return response;
    }
    return response;
  },
  (error: AxiosError) => {
    //console.log('caught by interceptor');
    //const
    //destrukturiramo propertije koje uzimamo iz error response
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 201:
        console.log(data.title);
        break;
      case 400:
        // if(data.errors){
        //    const modelStateErrors: string[]=[];
        //    for(const key in data.errors){
        //     if(data.errors[key]){
        //         modelStateErrors.push(data.errors[key]);
        //     }
        //    }
        //    throw modelStateErrors.flat();
        // }
        toast.error(data.title);
        break;
      case 401:
        toast.error("Neuspješna prijava");
        break;
      case 404:
        toast.error(data.title);
        break;
      case 500:
        toast.error(data.title);
        //router.navigate('/server-error', {state: {error: data}});
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Account = {
  login: (values: any) => requests.post("Account/login", values),
  register: (values: any) => requests.post("account/register", values),
  currentUser: () => requests.get("account/currentUser"),
  // fetchAddress: ()=>requests.get('account/savedAddress'),
  updateUser: (userData: any) => requests.post("account/updateUser", userData),
};

const Course = {
  list: (params: URLSearchParams) =>
    requests.get("course/getAllCourses", params),
  fullList: (params: URLSearchParams) =>
    requests.get("course/getAllCoursesList", params),
  getMy: (id: string) => requests.get(`course/getMyCourses/${id}`),
  getProfessorCourses: (id: number) =>
    requests.get(`course/getProfessorsCourses/${id}`),
  fetchFilters: () => requests.get("course/filters"),
  create: (values: any) => requests.post("course/CreateCourse", values),
};

const Professor = {
  GetAllProfessors: (params: URLSearchParams) => requests.get("professor/GetAllProfessors", params),
  getProfessorYearsPrograms:(id:number)=>requests.get(`professor/getProfessorYearsPrograms/${id}`),
  fetchFilters:()=>requests.get("professor/filters"),
};

const Theme = {
  getAll: (params: URLSearchParams) =>
    requests.get("theme/GetAllThemes", params),
  create: (values: any) => requests.post("theme/CreateTheme", values),
  fetchFilters: () => requests.get("theme/filters"),
  updateTheme: (themeData: any) => requests.post("theme/updateTheme", themeData),

};
const Message = {
  getAll: () => requests.get("theme/GetAllMessages"),
  createMessage: (values: any) => requests.post("theme/CreateMessage", values),
};

const agent = {
  Account,
  Course,
  Professor,
  Theme,
  Message,
};

export default agent;
