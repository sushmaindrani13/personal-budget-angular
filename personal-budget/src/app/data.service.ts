import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public dataSource: any = {
    datasets: [
        {
            data: [],
            backgroundColor: [
                "#FF5733",  
                "#33FF57",  
                "#3357FF",  
                "#FF33A6",  
                "#FFD700",  
                "#800080",  
                "#00CED1"   
            ]
        }
    ],
    labels: []
};
  constructor(private http: HttpClient) {
    this.getDataMethod();
   }

   isEmpty(val:any){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
  }

   getDataMethod(){
    if (this.isEmpty(this.dataSource.datasets[0].data)|| this.isEmpty(this.dataSource.labels)){
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => { 
      for (var i = 0; i < res.myBudget.length; i++) {
      this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
      this.dataSource.labels[i] = res.myBudget[i].title;
   }
});
   }
  }
  }
