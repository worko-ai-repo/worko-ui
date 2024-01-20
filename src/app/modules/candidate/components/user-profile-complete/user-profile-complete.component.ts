import { Component, OnInit, Input } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from 'chart.js';

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
  constructor(private candidateSrv: CandidateProfileService, private Storage: StorageService) { }

  ngOnInit(): void {
    console.log(this.candidateSocial);
    console.log(this.profileCompletion)


  }

  ngOnChanges(): void {
    // console.log(this.workExperienceDetails, "workExperienceDetails");
    // console.log(this.candidateSocial);
    // console.log(this.profileCompletion);
    if (this.profileCompletion && this.userType == "Candidate") {
      this.candidateProfile = this.profileCompletion?.candidate;

      this.drawDonutChart(this.candidateProfile);
    }

  }


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
            // position: 'right', or 'left'

          },
          
          tooltip: {
            enabled: true,
          },

        },
        
        cutout: 60, // Radius of the hole in the center of the doughnut (in percentage)
        circumference: 360, // Angle in degrees to control the arc's size
        rotation: -0.5 * Math.PI, // Angle in degrees to rotate the doughnut
        spacing: 3, // S
        radius: 60
      },
      
    });
  }
}

