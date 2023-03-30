import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IsLoggedInService } from '../admin/is-logged-in.service';
import { AccountService } from '../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { MongoService } from '../services/mongo.service';
import * as _ from 'underscore'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() userIsLoggedIn = new EventEmitter();
  user = '';
  password = '';
  loginForm: FormGroup

  constructor(
    private usersService: AccountService,
    private isLoggedInService: IsLoggedInService,
    private router: Router,
    private MatSnackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.loginForm = new FormGroup({
      user: new FormControl(null),
      password: new FormControl(null),
    })

  }
  ngOnInit(): void { }

  login(input: any) {
    this.usersService.login(input.user, input.password, (err: any, login: any) => {
      if (err && err.error.message === "Incorrect username.") {
        this.loginForm.controls['user'].setErrors({ wrongusername: true })
      } else if (err && err.error.message === "Incorrect password.") {
        this.loginForm.controls['password'].setErrors({ wrongpassword: true })
      } else {
        if (login && login.user.active) {
          this.router.navigate(['/home']);
          this.isLoggedInService.setIsLoggedIn(true);
          this.userIsLoggedIn.emit(login)
          this.MatSnackBar.open(`${login.user.first_name} ${login.user.last_name} logged in successfully`, "", { duration: 2000, panelClass: ['bg-success', 'text-white'], verticalPosition: "top" });
        } else if (login && !login.user.active) {
          this.MatSnackBar.open(`You account is not active`, "", { duration: 3000, panelClass: ['bg-danger', 'text-white'], verticalPosition: "top" });
        }
      }
    });
  }

  signup() {
    this.dialog.open(SignupComponent, {
      width: '400px',
      height: '90vh'
    })
  }

}



@Component({
  selector: 'signup-component',
  templateUrl: './signup-component.html',
  styleUrls: ['./login.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup
  hatcheries: any;
  countries: any;
  chosenCountry: any;
  countryHatcheries: any;
  fileName: any;
  photo: any;
  constructor(
    public dialogRef: MatDialogRef<SignupComponent>,
    // private mongoService: MongoService,
    private sanitizer: DomSanitizer,
    private usersService: AccountService,
    private MatSnackBar: MatSnackBar,
  ) {
    this.photo = null
    // this.hatcheries = this.mongoService.getAllHatcheries()
    // this.countries = [...new Set(this.hatcheries.map(x => x.country))]
    this.signupForm = new FormGroup({
      user: new FormControl('', Validators.required),
      // country: new FormControl('', Validators.required),
      // clientId: new FormControl('', Validators.required),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern("[0-9]{10}")]),
      address: new FormControl(''),
      password: new FormControl('', Validators.required),
      permissions: new FormControl('', Validators.required)
    })
  }

  // chooseCountry(country) {
  //   this.chosenCountry = country
  //   this.countryHatcheries = _.where(this.hatcheries, { country: country })
  // }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.photo = reader.result
      };
    }
  }

  transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.photo);
  }

  signup(form: any) {
    console.log(form)
    form.photo = this.photo
    this.usersService.newUser(form, (msg: any) => {
      if (msg.error && msg.error.mes.err === 'userexist') {
        this.signupForm.controls['user'].setErrors({ wronguser: true })
      } else if (msg.error && msg.error.mes.err === 'emailexist') {
        this.signupForm.controls['email'].setErrors({ wrongemail: true })
      } else if (msg.error && msg.error.mes.err === 'phoneexist') {
        this.signupForm.controls['phone'].setErrors({ wrongphone: true })
      } else {
        this.dialogRef.close();
        this.MatSnackBar.open(`New account was created. Welcome to the club!`, "", { duration: 3000, panelClass: ['bg-success', 'text-white'], verticalPosition: "top" });
      }
      console.log(msg)
    })
  }
}