import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { Lesson } from "../model/lesson";


@Injectable({
    providedIn:'root'
})

export class CourseService{

    private subject = new BehaviorSubject<Course[]>([]);

    courses$ : Observable<Course[]> = this.subject.asObservable();

constructor(private http: HttpClient){
    this.loadAllCourses();
}

loadCourseById(courseId: number){
        return this.http.get<Course>(`/api/courses/${courseId}`)
            .pipe(
                shareReplay()
            );
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

searchLessons(search : string): Observable<Lesson[]>{
    return this.http.get<Lesson[]>('/api/lessons',{
        params: {
            filter: search,
            pageSize: "100"
        }
    })
    .pipe(
        map(res => res["payload"]),
        shareReplay()
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