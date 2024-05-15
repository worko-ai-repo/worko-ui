import { Component, HostListener, ViewChild } from '@angular/core';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { Router } from '@angular/router';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import * as data from 'src/assets/data/data.json';
import Globe from 'globe.gl';
import { assetUrl } from 'src/asset-url';
import { CompanyListingService } from '../../services/company-listing.service';
import { event } from 'jquery';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  getReferral: boolean = true;
  giveReferral: boolean = false;
  userLoggedIn: boolean = false;
  modalType = ModalType;
  showModal: ModalType | undefined;
  modalMessage: string = "";
  modalTitle: string = "";
  userType :  string = "";
  countryData: any = data;
  // refereeBenefits: any;
  // purposeList: any;
  // candidateBenefits: any;
  private intervalId: any;
  private intervalClient: any;
  private world: any;
  isShow: any = true;
  @ViewChild('slickModal1') public slickModal1: any;
  @ViewChild('slickModal2') public slickModal2: any;
  pageSize = 50;
  lastKey: string | undefined = undefined;
  loadedOnce: boolean = true;
  filterData: any = {
    teamSize: "",
    industryType: "",
    companyName: ""
  }
  companyList: any[] = [];
  triggerGudianceValue:boolean=false;
  constructor(private router: Router, private cognitoService: CognitoService,private companyListing: CompanyListingService) { }

  // private readonly preventDefault = function (e: any) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   return false;
  // };
  // ngAfterViewInit() {
  //   this.createGlobe();
  //   this.focusOnCountry();
  //   //this.clientInfo();
  // }

    // Reviews carousel section starts:

    reviews = [
      {
        "image": "/assets/index-images-KA/card-img1.png",
        "content": "After reaching out to numerous connections on LinkedIn without much success, I turned to Worko for help. The team went above and beyond to assist me in securing referrals, and within a few weeks, I started receiving interview calls from some of the companies I applied to.",
        "name": "Sneha Gupta",
        "company": "EY"
      },
      {
        "image": "/assets/index-images-KA/card-img2.png",
        "content": "Worko not only helped me secure referrals at my dream companies but also provided invaluable support during the interview process. The Interview Handholding service from a senior employee was immensely helpful and aided me greatly in my preparation.",
        "name": "Aditya Raj",
        "company": "Flipkart"
      },
      {
        "image": "/assets/index-images-KA/card-img3.png",
        "content": "Worko's Peer 2 Peer hiring approach is truly revolutionary. Unlike other platforms, they never bombard me with random CVs. Instead, I find top-tier candidates perfectly matched to our requirements. Not only have I earned a significant referral bonus, but my HR team is also thrilled with the quality of candidates I refer.",
        "name": "A referee from Paytm",
        "company": "Paytm"
      },
      {
        "image": "/assets/index-images-KA/card-img1.png",
        "content": "Despite applying to jobs on various portals like Naukri and IIMjobs, I wasn't making any headway. Thanks to Worko, not only did I secure strong referrals, but I also received interview calls, which was a game-changer for me.",
        "name": "Avijit Sarkar",
        "company": "Amazon"
      },
      {
        "image": "/assets/index-images-KA/card-img2.png",
        "content": "When I faced rejection for not receiving a referral on Worko, I reached out to their team for assistance. I was impressed by the detailed help I received, from CV preparation to finding the right job opportunities. Thanks to Worko, I found the platform to be a much-needed blessing.",
        "name": "Rahul Kumar",
        "company": "Swiggy"
      },
      {
        "image": "/assets/index-images-KA/card-img3.png",
        "content": "I initially referred candidates on Worko out of goodwill, even though my previous company lacked a referral policy. Little did I know that this act of kindness would come full circle. When I found myself laid off months later, Worko stepped in, offering their services free of charge. Their empathy, honesty, and transparency ultimately helped me secure a new job within just two months. Worko's support proved invaluable, showcasing their commitment to their users' success.",
        "name": "A Referee from Amazon",
        "company": "Amazon"
      },
      {
        "image": "/assets/index-images-KA/card-img1.png",
        "content": "I want to express my gratitude for creating Worko. It's a much-needed platform today. The website experience and referral process are seamless. Your personalized approach to engaging with job seekers is commendable and will likely lead to positive word-of-mouth marketing. Achieving so much in such a short time is impressive. Best of luck to your team!",
        "name": "Amit Jetwani",
        "company": "CareEdge group"
      },
      {
        "image": "/assets/index-images-KA/card-img1.png",
        "content": "Unlike other chaotic platforms, Worko's Peer 2 Peer hiring approach has made finding quality candidates a breeze. No longer do I have to sift through unfiltered resumes. With Worko, I easily find experienced and vetted candidates, maximizing my referral bonus.",
        "name": "A Referee from Muthoot Fincorp",
        "company": "Muthoot Fincorp"
      },
      {
        "image": "/assets/index-images-KA/card-img2.png",
        "content": "I had been struggling to make headway in my job search, especially at the companies I aspired to work for. Worko came to my rescue, offering not only referral but also personalized guidance on resume improvement. With Worko's assistance, I finally managed to land an interview & then job at my dream company!",
        "name": "Sancheti Kaur",
        "company": "Walmart"
      },
      {
        "image": "/assets/index-images-KA/card-img3.png",
        "content": "My lack of attendance at a Tier-1 college posed challenges in securing interviews at top companies. Thanks to Worko, I found someone who not only referred me to Google but also provided invaluable guidance throughout the interview process. Worko truly opened doors for me at Google.",
        "name": "Rohan Kumar",
        "company": "Google"
      },
      {
        "image": "/assets/index-images-KA/card-img2.png",
        "content": "I appreciated the transparency and effort at Worko. Previously, I was referred to a few jobs but didn't receive any calls. Later on, with the help of the Worko team, I was able to find the right set of jobs for me. Their support throughout the process landed me quite a few good interviews and, eventually, a job.",
        "name": "Shruti Rai",
        "company": "Makemytrip"
      },
      {
        "image": "/assets/index-images-KA/card-img3.png",
        "content": "Beyond just revolutionizing recruitment, Worko excels in providing exceptional post-referral services. I've had the opportunity to offer guidance to candidates, and the experience has been incredibly rewarding. Not only am I helping others, but I'm also being compensated generously for my time and expertise.",
        "name": "A Referee from Google",
        "company": "Google"
      }
    ]

    marginLeft: number = -25; 
    marginLeftmd: number = -66;
    marginLeftsm: number = -78;
    currentIndex: number = 0;
    prevButtonDisabled: boolean = false;
    nextButtonDisabled: boolean = false;

    previousReview() {
      console.log(this.currentIndex);
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.nextButtonDisabled = false;
        this.adjustMarginLeft();
      }else {
          
          this.prevButtonDisabled = true;
          this.marginLeft = 3;
          this.marginLeftmd = 3;
          this.marginLeftsm = 6;
          // const lastReview = this.reviews.pop()!;
          // this.reviews.unshift(lastReview);
        }
        // this.adjustMarginLeft();
    }

    nextReview() {
      if (this.currentIndex < this.reviews.length - 3) {
        this.currentIndex++;
        this.prevButtonDisabled = false;
        this.adjustMarginLeft();
      } else {
        
        this.nextButtonDisabled = true;
        // const lastReview = this.reviews.pop()!;
        // this.reviews.unshift(lastReview);
        this.marginLeft = -15 -(this.currentIndex) * 50 -52;
        this.marginLeftmd =  -(this.currentIndex + 1) * 80 - 70;
        this.marginLeftsm = -(this.currentIndex + 1) * 80 - 140;
      }
      // this.adjustMarginLeft();
    }

    adjustMarginLeft() {
      this.marginLeft = -26 -this.currentIndex * 50 - this.currentIndex; 
      this.marginLeftmd = -66 - this.currentIndex * 80 - this.currentIndex;
      this.marginLeftsm = -78 - this.currentIndex * 86 - this.currentIndex;
    }

   // Reviews carousel section ends:


  // activeSection = 'peer';

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  //   const windowHeight = window.innerHeight;
  //   const sectionHeight = windowHeight;

  //   if (scrollPosition < sectionHeight) {
  //     this.activeSection = 'peer';
  //   } else if (scrollPosition < 2 * sectionHeight) {
  //     this.activeSection = 'feedback';
  //   } else {
  //     this.activeSection = 'smart';
  //   }
  // }

  async ngOnInit(): Promise<void> {
    this.getCompanyDetails();
    setInterval(() => {
      this.swapValues();
    }, 3000);

    this.userLoggedIn = await this.cognitoService.isLoggedIn();
      // $(".home-banner .btn-dark").addClass("active");
      // this.startInterval();
  

  }

  swapValues() {
    const temp = this.getReferral;
    this.getReferral = this.giveReferral;
    this.giveReferral = temp;
  }

  openGetReferral() {
    if (this.userLoggedIn) {
      this.redirectToEmployeeReferral();
    } else {
      this.userType = "employee";
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
  }

  async redirectToCompanyListing() {
    this.router.navigateByUrl('/company-listing');
  }

  async redirectToEmployeeReferral() {
    this.router.navigateByUrl('/employee/Referral');
  }

  // gData = [
  //   {
  //     lat: 19.076090,
  //     lng: 72.877426,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   },
  //   {
  //     lat: 28.644800,
  //     lng: 77.216721,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   },
  //   {
  //     lat: 22.719568,
  //     lng: 90.857727,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   },
  //   {
  //     lat: 40.732998,
  //     lng: 74.864273,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   },
  //   {
  //     lat: 39.916668,
  //     lng: 100.383331,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   },
  //   {
  //     lat: 38.889805,
  //     lng: -90.009056,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   }

  // ]


  // onClickShow(isShow: any) {
  //   this.getReferral = isShow;

  //   if (this.getReferral == true) {
  //     $(".home-banner .btn-dark").addClass("active");
  //     $(".home-banner .btn-light").removeClass("active");
  //   }
  //   else {
  //     $(".home-banner .btn-light").addClass("active");
  //     $(".home-banner .btn-dark").removeClass("active");
  //   }


  // }
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    prevArrow: false,
    nextArrow: false,
    vertical: true,
    verticalScrolling: true,
    speed: 1000,
    infinite: true,
  };


  // startInterval(): void {
  //   this.intervalId = setInterval(() => {

  //     if (this.getReferral == true) {
  //       this.getReferral = false;
  //       $(".home-banner .btn-light").addClass("active");
  //       $(".home-banner .btn-dark").removeClass("active");

  //     }
  //     else {
  //       this.getReferral = true;
  //       $(".home-banner .btn-dark").addClass("active");
  //       $(".home-banner .btn-light").removeClass("active");

  //     }

  //   }, 3000);
  // }

  // stopInterval(): void {
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId);
  //     this.intervalId = null;
  //   }
  //   if (this.intervalClient) {
  //     clearInterval(this.intervalClient);
  //     this.intervalClient = null;
  //   }
  // }
  // createGlobe(): void {

  //   const earthImg = assetUrl('earth-dark.jpg');
  //   const markerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 30" fill="none">
  //   <path fill="currentColor" d="M8 3.77796C8 1.78467 9.435 0.164062 11.2 0.164062H28.8C30.565 0.164062 32 1.78467 32 3.77796V20.0405C32 22.0338 30.565 23.6544 28.8 23.6544H16.84C16.25 22.2145 15.345 20.9722 14.22 20.0405H19.2V18.2335C19.2 17.2341 19.915 16.4266 20.8 16.4266H24C24.885 16.4266 25.6 17.2341 25.6 18.2335V20.0405H28.8V3.77796H11.2V6.55049C10.26 5.935 9.165 5.5849 8 5.5849V3.77796ZM8 7.39185C8.63035 7.39185 9.25452 7.53206 9.83688 7.80449C10.4192 8.07691 10.9484 8.4762 11.3941 8.97958C11.8398 9.48295 12.1934 10.0805 12.4346 10.7382C12.6758 11.3959 12.8 12.1008 12.8 12.8127C12.8 13.5246 12.6758 14.2295 12.4346 14.8872C12.1934 15.5448 11.8398 16.1424 11.3941 16.6458C10.9484 17.1492 10.4192 17.5485 9.83688 17.8209C9.25452 18.0933 8.63035 18.2335 8 18.2335C7.36966 18.2335 6.74548 18.0933 6.16312 17.8209C5.58076 17.5485 5.05161 17.1492 4.60589 16.6458C4.16017 16.1424 3.8066 15.5448 3.56538 14.8872C3.32416 14.2295 3.2 13.5246 3.2 12.8127C3.2 12.1008 3.32416 11.3959 3.56538 10.7382C3.8066 10.0805 4.16017 9.48295 4.60589 8.97958C5.05161 8.4762 5.58076 8.07691 6.16312 7.80449C6.74548 7.53206 7.36966 7.39185 8 7.39185ZM6.665 20.0405H9.33C13.015 20.0405 16 23.4116 16 27.5675C16 28.3976 15.405 29.0752 14.665 29.0752H1.335C0.595 29.0752 0 28.4032 0 27.5675C0 23.4116 2.985 20.0405 6.665 20.0405Z" fill="white"/>
  //   </svg>`;
  //   // console.log(earthImg, markerSvg);
  //   this.world = Globe()
  //     .width(1200).height(1200).backgroundColor("#fff0")
  //     .globeImageUrl(earthImg)
  //     .htmlElementsData(this.gData)
  //     .htmlElement((d: any) => {
  //       const el = document.createElement('div');
  //       el.innerHTML = "<div id='" + d.id + "' style='visibility: hidden'>" + d.popupHtml + "</div>" + markerSvg;
  //       el.style.color = d.color;
  //       el.style.width = `${d.size}px`;
  //       el.style.pointerEvents = 'auto';
  //       el.style.cursor = 'pointer';
  //       el.onclick = () => { this.clickOnMarker(d) };
  //       return el;
  //     })
  //     .hexPolygonsData(this.countryData.features)
  //     .hexPolygonResolution(3)
  //     .hexPolygonMargin(0.5)
  //     // .hexPolygonUseDots(true)
  //     .hexPolygonColor(() => "#57e1ff")
  //     // .hexPolygonLabel(({ properties: d }) => `
  //     //   <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
  //     //   Population: <i>${d.POP_EST}</i>
  //     // `)

  //     (document.getElementById("globeViz")!);
  //   this.world.controls().autoRotate = true;
  //   this.world.controls().autoRotateSpeed = 0.4;
  //   this.world.controls().enableZoom = false;
  // }
  // clickOnMarker(d: any): any {
  //   this.gData.forEach((element: any) => {
  //     let elem = document.getElementById(element.id);
  //     if (elem) {
  //       if (element.id == d.id) {
  //         elem!.style.visibility = "visible";
  //       } else {
  //         elem!.style.visibility = "hidden";
  //       }
  //     }
  //   });
  // }

  // private focusOnCountry(): void {
  //   if (this.world) {
  //     // Set the initial camera position to focus on the country
  //     this.world.pointOfView({ lat: 39.916668, lng: 116.38333 }, 300);
  //   }
  // }
  // clientInfo(): void {
  //   setTimeout(() => {
  //     this.intervalClient = setInterval(() => {
  //       var elements: any[] = [];
  //       this.gData.forEach((element: any) => {
  //         let elem = document.getElementById(element.id);
  //         if (elem) {
  //           elem!.style.visibility = "hidden";
  //           elements.push(element.id);
  //         }
  //       });
  //       const randomIndex = Math.floor(Math.random() * elements.length);
  //       let elemVisible = document.getElementById(elements[randomIndex]);
  //       elemVisible!.style.visibility = "visible";

  //       // console.log(randomIndex, elements);

  //       elements = [];

  //     }, 2000);
  //   }, 1000);

  // }
  async getCompanyDetails() {
   
     
      await this.companyListing.getCompanyListing(this.pageSize, this.lastKey, this.filterData.teamSize, this.filterData.industryType, this.filterData.companyName).then(async (response) => {
        if (response) {
          console.log("Helo11");
          //this.spinner.hide();
          // if (this.loadedOnce) {
          //   this.companyList = [];
          // }
          this.companyList = this.companyList.concat(response.data);
          this.lastKey = response.pagination.lastKey;
          this.loadedOnce = false;
          console.log(this.companyList)
          //  this.filterCompanies(); // Filter companies after updating companyList
        }
      })
        .catch(error => {
          console.error('Display Company Listing Error:', error);
          //this.spinner.hide();
        });
    }
    openReferralPage(item: any) {
      // Trigger the event when referral is requested
      this.companyListing.setReferralData(item);
      //this.companyListing.setrequestReferralData(event,item);
      this.router.navigateByUrl('/company-listing');
    }
    openGudiancePage(item:any){
      
      if(item){
        this.triggerGudianceValue=!this.triggerGudianceValue
        console.log(this.triggerGudianceValue)
        this.companyListing.setGuidanceData(this.triggerGudianceValue);
        this.router.navigateByUrl('/company-listing');
      }
    }


  /**
   * Open modal.
   *
   * @param {ModalType} modalType
   * @param {string} [message = ""]
   * @param {string} [title = ""]
   * @returns {void}
   */
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }
  /**
   * Close modal.
   *
   * @returns {void}
   */
  closeModal(): void {
    this.modal.cancel();
  }

  async receiveDataFromChild(userType: any) {
    console.log(userType);
    this.closeModal();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if (this.userLoggedIn) {
      if (userType == "CAND") {
        this.router.navigate(['/candidate/dashboard']);
      } else {
        this.router.navigate(['/employee/Dashboard']);
      }
    }
  }

  purposeList = [
    {
      image: '/assets/index-images-KA/purpose1.png', title: "Peer-to-Peer Hiring", text: "We facilitate connections between candidates and employees, helping candidates secure referrals and employees maximise referral bonuses."
    },
    {
      image: '/assets/index-images-KA/purpose2.png', title: " Interview Hand Holding", text: "During the hiring process, have an internal employee vouch and follow-up for you and provide guidance at each step"
    },
    {
      image: '/assets/index-images-KA/purpose3.png', title: "Feedback & Transparency", text: "We offer comprehensive job application analysis, recruiter feedback for every referral, and an application status report"
    },
    {
      image: '/assets/index-images-KA/purpose4.png', title: "Career Guidance", text: "While candidates can get guidance from industry experts, employees can offer their services and earn, creating a win-win path to success."
    },
    {
      image: '/assets/index-images-KA/purpose5.png', title: "Smart Matching Algorithm", text: "Our advanced algorithm provides detailed feedback and scores to candidates, highlighting their suitability. It informs employees why a referral would be ideal, enhancing the quality of recommendations"
    },
    {
      image: '/assets/index-images-KA/purpose6.png', title: " Access to Hidden Job", text: "Get access to hidden jobs that are not available on any other platform"
    }
  ]

  refereeBenefits = [
    {
      image: '/assets/index-images-KA/rbenefits1.png', text: " Get pre-vetted candidates for referral through our smart matching algorithm."
    },
    {
      image: '/assets/index-images-KA/rbenefits2.png', text: "Refer best of talent and maximise corporate referral bonus."
    },
    {
      image: '/assets/index-images-KA/rbenefits3.png', text: " Earn through mock interviews, referrals and mentorship."
    },
    {
      image: '/assets/index-images-KA/rbenefits4.png', text: "Extend a hand today, and when you need it, the universe echoes your kindness."
    },
    {
      image: '/assets/index-images-KA/rbenefits5.png', text: " Your anonymity, assured and preserved"
    },
  ]

  candidateBenefits = [
    {
      image: '/assets/index-images-KA/cbenefits1.png', text: "Get reviewed and referred by the best employees."
    },
    {
      image: '/assets/index-images-KA/cbenefits2.png', text: " Increase chances of interview calls by 20X!"
    },
    {
      image: '/assets/index-images-KA/cbenefits3.png', text: " Support and guidance from an internal employee throughout the hiring process."
    },
    {
      image: '/assets/index-images-KA/cbenefits4.png', text: " AI-powered profile analysis to provide feedback and guidance on the right job"
    },
    {
      image: '/assets/index-images-KA/cbenefits5.png', text: " Get resume reviewed, career guidance, mock interview from senior industry professionals"
    },
  ]
}

