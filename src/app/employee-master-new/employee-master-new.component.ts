import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeMasterNewServices } from '../services/ProviderAdminServices/employee-master-new-services.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-employee-master-new',
  templateUrl: './employee-master-new.component.html',
  styleUrls: ['./employee-master-new.component.css']
})
export class EmployeeMasterNewComponent implements OnInit {

  //ngModel
  titleID: any;
  firstname: any;
  middlename: any;
  lastname: any;
  genderID: any;
  contactNo: any;
  designationID: any;
  emergency_contactNo: any;
  dob: any;
  today = new Date();
  mindate: any;
  maxdate: any;
  age: any;
  emailID: any;
  maritalStatusID: any;
  aadharNumber: any;
  panNumber: any;
  qualificationID: any;
  username: any;
  user_password: any;
  doj: any;
  username_status: any;
  showHint: boolean;
  username_dependent_flag: boolean;
  isExistAadhar: boolean = false;
  isExistPan: boolean = false;
  idMessage: string;
  id: any;
  confirmMessage: any;

  //Demographics ngModel
  fatherName: any;
  motherName: any;
  currentAddressLine1: any;
  currentAddressLine2: any;
  countryId: any = 1;
  currentState: any;
  currentDistrict: any;
  currentPincode: any;
  permanentAddressLine1: any;
  permanentAddressLine2: any;
  permanentState: any;
  permanentDistrict: any;
  permanentPincode: any;
  isPresent: any;
  isPermanent: any;



  //array
  searchResult: any = [];
  titles: any = [];
  genders: any = [];
  designations: any = [];
  maritalStatuses: any = [];
  eduQualifications: any = [];
  states: any = [];
  districts: any = [];
  communities: any = [];
  religion: any = [];
  objs: any = [];

  //flags
  tableMode = true;
  formMode = false;
  editMode = false;

  //constants & variables
  emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
  userNamePattern = /^[0-9a-zA-Z]+[0-9a-zA-Z-_.]+[0-9a-zA-Z]$/;
  passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

  @ViewChild('userCreationForm') userCreationForm: NgForm;
  @ViewChild('demographicsDetailsForm') demographicsDetailsForm: NgForm;
  @ViewChild('communicationDetailsForm') communicationDetailsForm: NgForm;

  // md2.data: Observable<Array<item>>;

  constructor(public employeeMasterNewService: EmployeeMasterNewServices,
    public dataService: dataService,
    public dialogService: ConfirmationDialogsService,
    public dialog: MdDialog) { }

  ngOnInit() {
    this.getAllUserDetails();
  }
  /*
   * All details of the user
   */

  getAllUserDetails() {
    this.employeeMasterNewService.getAllUsers().subscribe(response => {
      if (response) {
        console.log("All details of the user", response);
        console.log("filtered user", response.filter((item) => {
          return item.userID == 807;
        }))
        this.searchResult = response;
      }
    }, err => {
      console.log("Error", err);
    })
  }
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
    this.dob = new Date();
    this.dob.setFullYear(this.today.getFullYear() - 20);
    this.maxdate=new Date();
    this.maxdate.setFullYear(this.today.getFullYear() - 20);
    this.mindate=new Date();
    this.mindate.setFullYear(this.today.getFullYear() - 70);
    this.employeeMasterNewService.getCommonRegistrationData().subscribe(res => this.showGenderOnCondition(res));
    this.employeeMasterNewService.getAllDesignations().subscribe(res => this.getAllDesignationsSuccessHandler(res));
    this.employeeMasterNewService.getAllMaritalStatuses().subscribe(res => this.getAllMaritalStatusesSuccessHandler(res));
    this.employeeMasterNewService.getAllQualifications().subscribe(res => this.getAllQualificationsSuccessHandler(res));
    this.employeeMasterNewService.getAllCommunities().subscribe(res => this.getCommunitiesSuccessHandler(res));
    this.employeeMasterNewService.getAllStates(this.countryId).subscribe(res => this.getAllStatesSuccessHandler(res));


  }
  showTable() {
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
    }
    else {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
    }
  }
  /*
  * Display gender on condition
  */

  setGenderOnCondition() {
    if (this.titleID == 2 || this.titleID == 4 || this.titleID == 5 || this.titleID === 13) {
      this.genderID = 2;
    }
    else if (this.titleID == 3 || this.titleID == 8) {
      this.genderID = 1;
    }
    else {
      this.genderID = "";
    }
  }
  showGenderOnCondition(response) {
    console.log("Display gender on condition", response);
    this.titles = response.m_Title;
    this.genders = response.m_genders;
  }

  calculateAge(date) {
    if (date != undefined) {
      this.age = this.today.getFullYear() - date.getFullYear();
      const month = this.today.getMonth() - date.getMonth();
      if (month < 0 || (month === 0 && this.today.getDate() < date.getDate())) {
        this.age--; //age is ng-model of AGE
      }
    }
  }

  /*
  * User name availability
  */

  checkUserNameAvailability(username) {
    console.log("user", this.username);
    this.employeeMasterNewService
      .checkUserAvailability(username)
      .subscribe(response => this.checkUsernameSuccessHandeler(response));
  }

  checkUsernameSuccessHandeler(response) {
    console.log('username existance status', response);
    if (response.response == 'userexist') {
      this.username_status = 'User Login ID Exists!! Type Different Please!';
      this.showHint = true;
      this.username_dependent_flag = true;
      this.username = null;

    }
    if (response.response == 'usernotexist') {
      if (
        this.username != '' &&
        (this.username != undefined && this.username != null)
      ) {
        console.log("if response", response);
        this.showHint = false;
        this.username_dependent_flag = false;
      } else {
        console.log("else response", response);
        this.showHint = true;
        this.username_dependent_flag = true;
        this.username_status = 'Username can\'t be blank';
      }
    }
  }

  /*
  * Get all Designations
  */
  getAllDesignationsSuccessHandler(response) {
    console.log("Display All Designations", response);
    this.designations = response;
  }
  /*
  * dob
  */
  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  /*
  * Get all marital statuses
  */
  getAllMaritalStatusesSuccessHandler(response) {
    console.log("Display all marital status", response);
    this.maritalStatuses = response;
  }
  /*
 * Get all educational qualifications
 */
  getAllQualificationsSuccessHandler(response) {
    console.log("Display all Qualifications", response);
    this.eduQualifications = response;
  }
  /*
 * Get all communities
 */
  getCommunities() {
    this.employeeMasterNewService.getAllCommunities().subscribe(response => {
      if (response) {
        console.log("All communities", response);
        this.communities = response;
      }
    }, err => {
      console.log("Error", err);
    });
  }
  getCommunitiesSuccessHandler(response) {
    console.log("Display all Communities", response);
    this.communities = response;
  }
  /*
  * Get all religion
  */
  getReligion() {
    this.employeeMasterNewService.getAllReligion().subscribe(response => {
      if (response) {
        console.log("All Religion", response);
        this.religion = response;
      }
    }, err => {
      console.log("Error", err);
    });
  }
  getReligionSuccessHandler(response) {
    console.log("Display all religions", response);
    this.religion = response;
  }
  /*
    * Check Uniqueness in Aadhar
    */
  checkAadhar() {
    console.log('aadharNumber', this.aadharNumber);

    if (this.aadharNumber.length == 12) {
      this.employeeMasterNewService.validateAadhar(this.aadharNumber).subscribe(
        (response: any) => {
          this.checkAadharSuccessHandler(response);
        },
        err => { console.log("Error", err); }
      );
    }
  }
  checkAadharSuccessHandler(response) {
    if (response.response == 'true') {
      this.isExistAadhar = true;
      this.idMessage = 'Adhaar Number Already Exists';
    } else {
      this.isExistAadhar = false;
      this.idMessage = '';
    }
  }
  /*
    * Check Uniqueness in Pan
    */
  checkPan() {
    if (this.panNumber.length == 10) {
      this.employeeMasterNewService.validatePan(this.panNumber).subscribe(
        response => {
          console.log("pan response", response);
          this.checkPanSuccessHandler(response);
        },
        err => { console.log("Error", err); }
      );
    }
  }
  checkPanSuccessHandler(response) {
    if (response.response == 'true') {
      this.isExistPan = true;
      this.idMessage = 'Pan Number Already Exists';
    } else {
      this.isExistPan = false;
      this.idMessage = '';
    }
  }

  /*
    * Get all States
    */
  getAllStatesSuccessHandler(response) {
    console.log("Display all States", response);
    this.states = response;
  }
  /*
    * Get all Districts
    */
  getDistricts(currentStateID) {
    this.employeeMasterNewService.getAllDistricts(this.currentState).subscribe(response => {
      this.getDistrictsSuccessHandler(response)
    },
      err => {
        console.log("Error", err);
      });
  }
  getDistrictsSuccessHandler(response) {
    console.log("Display all Districts", response);
    this.districts = response;
  }

  disable_permanentAddress_flag: boolean = false;

  addressCheck(value) {
    if (value.checked) {
      this.permanentAddressLine1 = this.currentAddressLine1;
      this.permanentAddressLine2 = this.currentAddressLine2;
      this.permanentState = this.currentState;

      this.permanentDistrict = this.currentDistrict;
      this.permanentDistrict = this.currentDistrict;
      this.permanentPincode = this.currentPincode;

      this.isPermanent = '1';
      this.isPresent = '0';
      this.disable_permanentAddress_flag = true;
    } else {
      this.permanentAddressLine1 = '';
      this.permanentAddressLine2 = '';
      this.permanentState = '';
      this.permanentDistrict = '';
      this.permanentPincode = '';
      this.isPermanent = '0';
      this.isPresent = '1';
      this.disable_permanentAddress_flag = false;

      this.permanentDistrict = [];

    }
  }

  reset() {
    this.permanentDistrict = [];
    this.currentDistrict = [];
  }

  /*
 * Method for addition of objects 
 */
  add_object(titleID, firstname, middlename, lastname,
    genderID, dob, contactNo, emailID, maritalStatusID, aadharNumber, panNumber, qualificationID,
    emergency_contactNo, username, user_password, doj, fatherName, motherName, currentAddressLine1, currentAddressLine2,
    currentStateID, currentDistrictID, currentPincode, permanentAddressLine1, permanentAddressLine2, permanentStateID,
    permanenttDistrictID, permanentPincode) {
    var tempObj = {
      'titleID': this.titleID,
      'firstname': this.firstname,
      'middlename': this.middlename,
      'lastname': this.lastname,
      'genderID': this.genderID,
      'dob': this.dob,
      // 'age': this.age,
      'contactNo': this.contactNo,
      'emailID': this.emailID,
      // 'designationID': this.designationID,
      'maritalStatusID': this.maritalStatusID,
      'aadharNumber': this.aadharNumber,
      'panNumber': this.panNumber,
      'qualificationID': this.qualificationID,
      'emergency_contactNo': this.emergency_contactNo,
      'username': this.username,
      'password': this.user_password,
      'doj': this.doj,
      'fatherName': this.fatherName,
      'motherName': this.motherName,
      'currentAddressLine1': this.currentAddressLine1,
      'currentAddressLine2': this.currentAddressLine2,
      'currentState': this.currentState,
      'currentDistrict': this.currentDistrict,
      'currentPincode': this.currentPincode,
      'permanentAddressLine1': this.permanentAddressLine1,
      'permanentAddressLine2': this.permanentAddressLine2,
      'permanentState': this.permanentState,
      'permanenttDistrict': this.permanentDistrict,
      'permanentPincode': this.permanentPincode

    }
    console.log("add objects", tempObj);
    this.objs.push(tempObj);
    this.checkUserNameAvailability(name);
    this.userCreationForm.resetForm();
    this.demographicsDetailsForm.resetForm();
    this.communicationDetailsForm.resetForm();

  }
  /*
  * Removing single object
  */
  remove_obj(index) {
    this.objs.splice(index, 1);
  }
  /*
 * User creation
 */
  createUser() {
    var reqObject = [];
    for (var i = 0; i < this.objs.length; i++) {
      var tempObj = {
        'titleID': "" + this.objs[i].titleID,
        'firstName': this.objs[i].firstname,
        'middleName': this.objs[i].middlename,
        'lastName': this.objs[i].lastname,
        'genderID': "" + this.objs[i].genderID,
        'dOB': this.objs[i].dob,
        //  'age': this.objs[i].age,
        'contactNo': this.objs[i].contactNo,
        'emailID': this.objs[i].emailID,
        'designationID': this.objs[i].designationID,
        'maritalStatusID': "" + this.objs[i].maritalStatusID,
        'aadhaarNo': this.objs[i].aadharNumber,
        'pAN': this.objs[i].panNumber,
        'qualificationID': "" + this.objs[i].qualificationID,
        'emergencyContactNo': this.objs[i].emergency_contactNo,
        'userName': this.objs[i].username,
        'password': this.objs[i].password,
        'dOJ': this.objs[i].doj,
        'fathersName': this.objs[i].fatherName,
        'mothersName': this.objs[i].motherName,
        // religionID
        // communityID
        'addressLine1': this.objs[i].currentAddressLine1,
        'addressLine2': this.objs[i].currentAddressLine2,
        'StateID': this.objs[i].currentState,
        'districtID': "" + this.objs[i].currentDistrict,
        'pinCode': this.objs[i].currentPincode,
        'statusID':"1",
       // 'isPermanent':'1',
        'isPresent':'1',
        'createdBy': "Janani",
      }
      reqObject.push(tempObj);
    }
    console.log("Details to be saved", reqObject);
    this.employeeMasterNewService.createNewUser(reqObject).subscribe(response => {
      console.log("response", response);
      this.editMode = false;
      this.dialogService.alert("User Created successfully");
      this.objs = [];
      this.getAllUserDetails();

    })

  }
  clearAll() {
    this.userCreationForm.resetForm();
    this.demographicsDetailsForm.resetForm();
    this.communicationDetailsForm.resetForm();
  }
 
  showEditForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = true;
  }
  editUserDetails(data) {
    console.log('data to edit', data);

    this.showEditForm();
    if (this.formMode == true && this.editMode == true) {

      // console.log("Initial value", this.data);
      this.employeeMasterNewService.getCommonRegistrationData().subscribe(res => this.showGenderOnCondition(res));
      this.employeeMasterNewService.getAllDesignations().subscribe(res => this.getAllDesignationsSuccessHandler(res));
      this.employeeMasterNewService.getAllMaritalStatuses().subscribe(res => this.getAllMaritalStatusesSuccessHandler(res));
      this.employeeMasterNewService.getAllQualifications().subscribe(res => this.getAllQualificationsSuccessHandler(res));
      // this.employeeMasterNewService.getAllCommunities().subscribe(res => this.getCommunitiesSuccessHandler(res));
      this.employeeMasterNewService.getAllStates(this.countryId).subscribe(res => this.getAllStatesSuccessHandler(res));
      this.edit(data);
    }

  }

  edit(data) {
    this.titleID = data.titleID;
    console.log('this.titleid', this.titleID, data.titleID);

    this.firstname = data.firstName;
    this.middlename = data.middleName;
    this.lastname = data.lastName;
    this.genderID = data.genderID;
    this.contactNo = data.contactNo;
    this.emailID = data.emailID;
    // this.age = this.data.age;
    this.dob = data.dOB;
    this.designationID = data.designationID;
    this.maritalStatusID = data.maritalStatusID;
    this.aadharNumber = data.aadhaarNo;
    this.panNumber = data.pAN;
    this.qualificationID = data.qualificationID;
    this.emergency_contactNo = data.emergencyContactNo;
    this.doj = data.dOJ;
    this.fatherName = data.fatherName;
    this.motherName = data.motherName;
    this.currentAddressLine1 = data.userAddressLine1;
    this.currentAddressLine2 = data.userAddressLine2;
    this.currentState = data.usercurrentStateID;
    this.currentDistrict = data.workingDistrictID;
    this.currentPincode = data.currentPincode;
  }
  update() {
    let update_tempObj = {
      'titleID': this.titleID,
      'firstName': this.firstname,
      'middleName': this.middlename,
      'lastName': this.lastname,
      'genderID': this.genderID,
      'dob': this.dob,
      //  'age': this.age,
      'contactNo': this.contactNo,
      'emailID': this.emailID,
      'maritalStatusID': this.maritalStatusID,
      'aadhaarNo': this.aadharNumber,
      'pAN': this.panNumber,
      'qualificationID': this.qualificationID,
      'emergencyContactNo': this.emergency_contactNo,
      'dOJ': this.doj,
      'fathersName': this.fatherName,
      'mothersName': this.motherName,
      'addressLine1': this.currentAddressLine1,
      'addressLine2': this.currentAddressLine2,
      'stateID': this.currentState,
      'districtID': this.currentDistrict,
      'pinCode': this.currentPincode,
      // 'userID': data.userID,
      // 'modifiedBy': data.createdBy

    }
    console.log('updateobj', update_tempObj);

    // this.employeeMasterNewService.updateProviderAdmin(update_tempObj).subscribe(response => {
    //  console.log("Data to be update", response);
    //   this.dialogRef.close("success");

  }
  /*
   * Activation and deactivation of the user
  */
  activateDeactivate(userID, flag) {
    let obj = {
      "userID": userID,
      "userDeleted": flag
    }
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.dialogService.confirm("Are you sure want to " + this.confirmMessage + "?").subscribe((res) => {
      if (res) {
        console.log("Deactivating or activating Obj", obj);
        this.employeeMasterNewService.userActivationDeactivation(obj)
          .subscribe((res) => {
            console.log('Activation or deactivation response', res);
            this.dialogService.alert(this.confirmMessage + "d successfully");
            this.getAllUserDetails();
          },
            (err) => {
              console.log(err);
            })
      }
    },
      (err) => {
        console.log(err);
      })
  }


}









