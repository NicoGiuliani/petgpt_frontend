interface ChatGPTResponse {
  role: string;
  content: string;
}

export interface MyResponse {
  message: ChatGPTResponse;
}
