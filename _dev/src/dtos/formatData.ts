export interface formatData<T> {
  toApi(data: T): T;
  fromApi(data: T): T;
}
