import { HttpException } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class AxiosClientService {
  private axiosClient: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.axiosClient = axios.create(config);

    this.axiosClient.interceptors.request.use((config) => {
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
      config.headers['Access-Control-Allow-Origin'] = '*';
      return config;
    });
    this.axiosClient.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        return error.response;
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosClient.get(url, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosClient.post(url, data, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosClient.put(url, data, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosClient.delete(url, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): void {
    if (error.response) {
      throw new HttpException(error.response.data, error.response.status);
    } else if (error.request) {
      throw new HttpException('No response received from the server', 500);
    } else {
      throw new HttpException('An error occurred during the request', 500);
    }
  }
}
