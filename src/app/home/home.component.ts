import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { CourseService } from '../services/courses.service';
import { LoadingService } from '../loading.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    private coursesService : CourseService,
    private loadingService : LoadingService
    ) {

  }

  ngOnInit() {

    this.reloadCourses();


  }

  reloadCourses(){

        // courses$.subscribe(val => console.log(val))

        this.beginnerCourses$ = this.coursesService.filterByCategory("BEGINNER");

        this.advancedCourses$ = this.coursesService.filterByCategory("ADVANCED");
  }



}




