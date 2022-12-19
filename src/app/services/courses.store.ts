import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({
    providedIn: 'root'
})
export class CoursesStore{

private subject = new BehaviorSubject<Course[]>([]);

courses$ : Observable<Course[]> = this.subject.asObservable();

constructor(
    private http : HttpClient,
    private loading: LoadingService,
    private msg : MessagesService){
    this.loadAllCourses();
}

private loadAllCourses() {
   const loadCourses$ = this.http.get<Course[]>('/api/courses')
    .pipe(
        map(res => res["payload"]),
        catchError(err => {
            const msg = "could not Load Courses";
            console.log(msg, err);
            this.msg.showErrors(msg);
            return throwError(err)
        }),
        tap(courses => this.subject.next(courses))
    );
    this.loading.showLoaderUntilCompleted(loadCourses$)
        .subscribe();
}

saveCourse(courseId: string,changes: Partial<Course>): Observable<any>{
    const courses = this.subject.getValue();
    const index = courses.findIndex(course => course.id == courseId)
    const newCourse: Course = {
        ...courses[index],
        ...changes
    };

    const newCourses: Course[] = courses.slice(0);

    newCourses[index] = newCourse;

    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes)
        .pipe(
            catchError(err => {
                const msg = "could not Update Course";
                console.log(msg, err);
                this.msg.showErrors(msg);
                return throwError(err)
            }),
            shareReplay()
        );
}

filterByCategory(category : string): Observable<Course[]>{
    return this.courses$
                .pipe(
                    map(courses => courses.filter(course => course.category == category)
                    .sort(sortCoursesBySeqNo)
                    )
                );
}

}