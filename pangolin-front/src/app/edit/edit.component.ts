import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from "@angular/forms";
import { first } from "rxjs/operators";
import { User } from "@app/_models";
import { AccountService, AlertService } from "@app/_services";

@Component({
  selector: "appyy-edit",
  templateUrl: "./edit.component.html"
})
export class EditComponent implements OnInit {
  user: User;
  form: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.user = this.accountService.userValue;
    this.form = this.formBuilder.group({
      family: ["", Validators.required],
      food: ["", Validators.required],
      race: ["", Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    console.log(
      this.form.controls["food"].value,
      this.form.controls["family"].value,
      this.form.controls["race"].value
    );
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.accountService
      .update(
        this.form.controls["food"].value,
        this.form.controls["family"].value,
        this.form.controls["race"].value
      )
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Update successful", {
            keepAfterRouteChange: true
          });
          this.router.navigate(["../"], { relativeTo: this.route });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
