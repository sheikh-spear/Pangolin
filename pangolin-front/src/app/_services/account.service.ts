import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "@environments/environment";
import { User } from "@app/_models";
import { Friend } from "@app/_models";
import { RegisterResponse } from "@app/_models";

@Injectable({ providedIn: "root" })
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("user"))
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(email, password) {
    return this.http
      .post<User>(`${environment.apiUrl}/login`, { email, password })
      .pipe(
        map(user => {
          if (user.token === undefined) {
            throw "login failed";
          }
          localStorage.setItem("user", JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  update(pfood, pfamily, prace) {
    console.log({
      food: pfood,
      family: pfamily,
      race: prace
    });
    return this.http
      .post<User>(`${environment.apiUrl}/update`, {
        food: pfood,
        family: pfamily,
        race: prace
      })
      .pipe(
        map(user => {
          localStorage.setItem("user", JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  addFriend(id) {
    console.log(id);
    return this.http
      .post<any>(`${environment.apiUrl}/addFriend`, { friend: id })
      .subscribe(res => {
        console.log(res);
        window.location.reload();
      });
  }

  deleteFriend(id) {
    console.log(id);
    return this.http
      .post<any>(`${environment.apiUrl}/deleteFriend`, { friend: id })
      .subscribe(res => {
        console.log(res);
        window.location.reload();
      });
  }

  getFriends() {
    return this.http.get<Friend[]>(`${environment.apiUrl}/everybody`).pipe(
      map(friends => {
        return friends;
      })
    );
  }

  logout() {
    localStorage.clear();
    this.userSubject.next(null);
    this.router.navigate(["/account/login"]);
  }

  register(user: User) {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/register`, user).pipe(
      map(u => {
        if (u.status === 500) {
          throw u.message;
        }
      })
    );
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`).pipe(
      map(x => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue.id) {
          this.logout();
        }
        return x;
      })
    );
  }
}
