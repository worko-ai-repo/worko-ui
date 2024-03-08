import { Component, OnInit, Input } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from 'chart.js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-profile-complete',
  templateUrl: './user-profile-complete.component.html',
  styleUrls: ['./user-profile-complete.component.scss']
})
export class UserProfileCompleteComponent implements OnInit {
  @Input() candidateSocial: any = "";
  @Input() profileCompletion: any = "";
  @Input() userType: any = "";
  // cprofileCompletionandidateLogos:any[]=[];
  // emailAddress: string = "";
  chart: any;
  candidateProfile: any;
  isChartLoaded: boolean = false;
  backgroundColor: any =['#1ED6FF', ' #268AFF', '#11489A', '#295CA8'];
  activeRoute: string = '';
  userLoggedIn: boolean = false;
  userRole: any;
  totalPercentage:any;
  isEmployee: boolean = true; // You can initialize it to the appropriate value based on your logic
  
  constructor( private router : Router, private candidateSrv : CandidateProfileService , private Storage : StorageService){}

  ngOnInit(): void {
    console.log(this.candidateSocial);
    console.log(this.profileCompletion)
    this.activeRoute = this.router.url;
    if (this.userType == "Candidate") {
      this.userRole = [
        {
          name: 'Edit',
          router: "/candidate/cedit-profile", 
         
        },
       
      ]
    }

    if (this.userType == "Employee") {
      this.userRole = [
        {
          name: 'Edit',
          router: "/employee/eEdit-profile"
        },
       
      ]
    }

  }

  ngOnChanges(): void {
    // console.log(this.workExperienceDetails, "workExperienceDetails");
    // console.log(this.candidateSocial);
    // console.log(this.profileCompletion);
 
    if (this.profileCompletion && this.userType == "Candidate") {
      this.candidateProfile = this.profileCompletion?.candidate;

      this.drawDonutChart(this.candidateProfile);
    }

    if (this.profileCompletion && this.userType == "Employee") {
      this.candidateProfile = this.profileCompletion?.employee;

      this.drawDonutChart(this.candidateProfile);
    }

    if (this.candidateProfile) {

      this.totalPercentage = 0;
      this.totalPercentage = this.candidateProfile.reduce((sum:any, element:any) => sum + element.curPerc, 0);

    }

  }
  // user():void {
  //   if(this.userRole =='Employee'){
  //     this.router.navigateByUrl('/employee/eEdit-profile')

  //   } else{
  //     this.router.navigateByUrl('/candidate/cEdit-profile')
  //   }
  // }


  drawDonutChart(jsonData: any) {
    // Transform JSON data into the format expected by Chart.js
    const labels = jsonData.map((item: any) => item.fieldGroup);
    const datasetData = jsonData.map((item: any) => item.curPerc);
//  const backgroundColors = ['rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 0.1)']; // You can customize the colors

    Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

    this.chart = new Chart('canvas', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: datasetData,
            backgroundColor: ['#1ED6FF', ' #268AFF', '#11489A', '#295CA8'],
            borderWidth: 0.5, // Adjust the width of the doughnut segments
            weight: 1,

          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
            // position: 'center'

          },
          
          tooltip: {
            enabled: false,
          },

        },
        
        cutout: 50, // Reduce the size of the hole in the center
        radius: '80%', // Radius of the hole in the center of the doughnut (in percentage)
        circumference: 360, // Angle in degrees to control the arc's size
        rotation: -0.5 * Math.PI, // Angle in degrees to rotate the doughnut
        spacing: 3, // S
        // radius: 100
      },
      
    });
  }
}

