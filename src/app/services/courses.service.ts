import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import { Course, sortCoursesBySeqNo } from "../model/course";


@Injectable({
    providedIn:'root'
})

export class CourseService{

    private subject = new BehaviorSubject<Course[]>([]);

    courses$ : Observable<Course[]> = this.subject.asObservable();

constructor(private http: HttpClient){
    this.loadAllCourses();
}

loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
        .pipe(
            map(res => res["payload"]),
            tap(courses => this.subject.next(courses))
        );

        loadCourses$.subscribe()
}

saveCourse(courseId : String, changes: Partial<Course>): Observable<any>{
    return this.http.put(`/api/courses/${courseId}`, changes)
        .pipe(
            shareReplay(),
            tap(() => this.loadAllCourses())
        );
}

filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
        .pipe(
            map(courses =>
                courses.filter(course => course.category == category)
                    .sort(sortCoursesBySeqNo)
            )
        )
}

}