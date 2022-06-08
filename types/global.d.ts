declare interface UserInfo {
  address: string;
  area: string;
  auth: string;
  avatar: string;
  birthday: string;
  create_time: string;
  email: string;
  id: string | number;
  phone: string;
  sex: string;
  signature: string;
  user_nickname: string;
  user_status: string | number;
  user_type: string | number;
}

declare interface ClassifyType {
  id: number;
  deescription: string;
  classifyName: string;
}

declare interface ArticleData {
  article_abstract: string;
  article_content: string;
  article_cover: string;
  article_keywords: string;
  article_status: number;
  article_title: string;
  author: number;
  author_nickname: string;
  classifyId: string;
  edit_date: string;
  editorType: number;
  id: number;
  post_date: string;
  isDel?: number;
  view_count?: number;
}
