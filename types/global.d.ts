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
  author: string;
  author_nickname: string;
  classifyId: string[] | string;
  edit_date?: Date | string;
  editorType: number;
  id?: number;
  post_date: Date | string;
  isDel?: number;
  view_count?: number;
}

interface ImageType {
  id: number;
  describe: string;
  name: string;
  src: string;
  type: number;
  update_time: string;
}

declare type ComponentRef<T> = InstanceType<T>;
