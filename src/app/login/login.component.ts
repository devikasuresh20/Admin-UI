import { Component, OnInit } from '@angular/core';
import { loginService } from '../services/loginService/login.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';



@Component({
	selector: 'login-component',
	templateUrl: './login.html',
	styleUrls: ['./login.css']
})

export class loginContentClass implements OnInit {
	model: any = {};
	userID: any;
	password: any;
	serviceProviderID: any;
	status: any;
	public loginResult: string;
	constructor(public loginservice: loginService,
		public router: Router,
		private alertMessage: ConfirmationDialogsService,
		public dataSettingService: dataService) { };

	ngOnInit() {
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.

	}

	login(userId: any, password: any) {
		// console.log(userId, password);
		if (userId.toLowerCase() === "SUPERADMIN".toLowerCase()) {
			this.loginservice.superAdminAuthenticate(userId, password)
				.subscribe(response => {
					if (response.isAuthenticated) {
						if (response.previlegeObj.length === 0) {
							console.log(response, "SUPERADMIN VALIDATED");
							localStorage.setItem('authToken', response.key);
							this.dataSettingService.Userdata = { "userName": "Super Admin" };
							this.dataSettingService.role = "SUPERADMIN";
							this.dataSettingService.uname = "Super Admin";
							this.router.navigate(['/MultiRoleScreenComponent']);
						}
						else {
							this.alertMessage.alert('User is not super admin');
						}

					}

				}, err => {
					console.log(err, "ERR while superadmin validation");
				});

		}
		// if (userId === "padmin" && password === "padmin") {
		// 	this.dataSettingService.Userdata = { "userName": "Diamond Khanna" };
		// 	this.dataSettingService.role = "PROVIDERADMIN";
		// 	this.router.navigate(['/MultiRoleScreenComponent']);
		// }
		else {
			this.loginservice.authenticateUser(userId, password).subscribe(
				(response: any) => this.successCallback(response),
				(error: any) => this.errorCallback(error));
		}

	};

	successCallback(response: any) {
		console.log(response);
		this.dataSettingService.Userdata = response;
		this.dataSettingService.userPriveliges = response.previlegeObj;
		this.dataSettingService.uid = response.userID;
		// this.dataSettingService.service_providerID = response.provider[0].providerID;
		this.dataSettingService.uname = this.userID;
		console.log("array", response.previlegeObj);

		if (response.isAuthenticated === true && response.Status === "Active") {
			localStorage.setItem('authToken', response.key);
			console.log("response.previlegeObj[0].serviceID", response.previlegeObj[0].serviceID);
			this.loginservice.getServiceProviderID(response.previlegeObj[0].serviceID).subscribe(response => this.getServiceProviderMapIDSuccessHandeler(response));
			// this.router.navigate(['/MultiRoleScreenComponent']);
			for (let i = 0; i < response.Previlege.length; i++) {

				// for (let j = 0; j < response.Previlege[i].Role.length; j++) {
				if (response.Previlege[i].Role === "ProviderAdmin") {
					// this.router.navigate(['/MultiRoleScreenComponent']);
					this.dataSettingService.role = "PROVIDERADMIN";
					console.log("VALUE SET HOGAYI");
				}
				else {
					this.dataSettingService.role = "";
				}
				// }
			}
			if (this.dataSettingService.role.toLowerCase() === "PROVIDERADMIN".toLowerCase()) {
				this.router.navigate(['/MultiRoleScreenComponent']);
			}
			else {
				this.alertMessage.alert('User is not a provider admin');
			}

		}
		if (response.isAuthenticated === true && response.Status === "New") {
			this.status = 'new';
			localStorage.setItem('authToken', response.key);
			this.router.navigate(['/setQuestions']);
		}
	};
	errorCallback(error: any) {
		if (error.status) {
			this.loginResult = error.errorMessage;
		} else {
			this.loginResult = 'Internal issue please try after some time';
		}
		// this.loading = false;
		console.log(error);
	};

	// encryptionFlag: boolean = true;
	dynamictype: any = 'password';
	showPWD() {
		this.dynamictype = 'text';
	}

	hidePWD() {
		this.dynamictype = 'password';
	}


	getServiceProviderMapIDSuccessHandeler(response) {
		console.log("service provider map id", response);
		if (response != undefined) {
			this.dataSettingService.service_providerID = response.serviceProviderID;
			this.serviceProviderID = response.serviceProviderID;
		}
		else {
			alert("Service Provider MAP ID is not fetched, undefined");
		}
	}


}
