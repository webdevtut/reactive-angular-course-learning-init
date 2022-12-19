import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { CourseService } from '../services/courses.service';
import { LoadingService } from '../loading.service';
import { MessagesService } from '../messages/messages.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(private http: HttpClient,
    private coursesService : CourseService,
    private loadingService : LoadingService,
    private messagesService : MessagesService
    ) {

  }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses(){

        // courses$.subscribe(val => console.log(val))

        this.loadingService.loadingOn();

        const courses$ = this.http.get<Course[]>('/api/courses')
        .pipe(
            catchError(err => {
                const message = "Testing";
                this.messagesService.showErrors(err.error.message);
                console.log(message, err);
                return throwError(err)
            }),
            finalize(()=> this.loadingService.loadingOff())
        );

        courses$.subscribe()


        this.beginnerCourses$ = this.coursesService.filterByCategory("BEGINNER");

        this.advancedCourses$ = this.coursesService.filterByCategory("ADVANCED");

        // const test = this.coursesService.filterByCategory("ADVANCED");

        // this.loadingService.showLoaderUntilCompleted(courses$)
      
        // this.advancedCourses$.subscribe(
        //   val =>{
        //     this.loadingService.loadingOn();
        //      if(val.length > 0){
        //     this.loadingService.loadingOff();
        //   }}
        // )
  }
}




