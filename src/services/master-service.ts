import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IStatusModel } from '../app/model/interface/status.model';
import { ICategoryModel } from '../app/model/interface/category.model';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private readonly http: HttpClient) { }

  public getAllStatus() {
    return this.http.get<IStatusModel[]>("http://localhost:3000/status");
  }

  public getAllCategory() {
    return this.http.get<ICategoryModel[]>("http://localhost:3000/categories");
  }

  public saveCategory(obj: ICategoryModel) {
    return this.http.post<ICategoryModel>("http://localhost:3000/categories", obj);
  }

  public updateCategory(id: string, obj: ICategoryModel) {
    return this.http.put<ICategoryModel>(`http://localhost:3000/categories/${id}`, obj);
  }

  public deleteCategory(id: string) {
    return this.http.delete<void>(`http://localhost:3000/categories/${id}`);
  }

  public saveEnquiry(obj: any) {
    return this.http.post("http://localhost:3000/employee", obj);
  }

  public getAllEnquiries() {
    return this.http.get("http://localhost:3000/employee");
  }

  public deleteEnquiry(id: string) {
    return this.http.delete(`http://localhost:3000/employee/${id}`);
  }
}