import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery'
import Globe from 'globe.gl';
import { assetUrl } from 'src/asset-url';
import * as data from 'src/assets/data/data.json';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { AnyPixelFormat } from 'three';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']

})

export class HomeComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  isShow: any = true;
  countryData: any = data;
  private intervalId: any;
  private intervalClient: any;
  private world: any;
  userLoggedIn: boolean = false;
  @ViewChild('slickModal1') public slickModal1: any;
  @ViewChild('slickModal2') public slickModal2: any;

  constructor(private router: Router, private cognitoService: CognitoService) {

  }

  private readonly preventDefault = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    return false;

  };


  gData = [
    {
      lat: 19.076090,
      lng: 72.877426,
      size: 20,
      color: ['white'],
      id: String(Math.random()),
      popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
    },
    {
      lat: 28.644800,
      lng: 77.216721,
      size: 20,
      color: ['white'],
      id: String(Math.random()),
      popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
    },
    {
      lat: 22.719568,
      lng: 75.857727,
      size: 20,
      color: ['white'],
      id: String(Math.random()),
      popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
    },
    {
      lat: 32.732998,
      lng: 74.864273,
      size: 20,
      color: ['white'],
      id: String(Math.random()),
      popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
    },
    {
      lat: 39.916668,
      lng: 116.383331,
      size: 20,
      color: ['white'],
      id: String(Math.random()),
      popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
    },
    {
      lat: 38.889805,
      lng: -77.009056,
      size: 20,
      color: ['white'],
      id: String(Math.random()),
      popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
    }

  ]


  onClickShow(isShow: any) {
    this.isShow = isShow;

    if (this.isShow == true) {
      $(".home-banner .btn-dark").addClass("active");
      $(".home-banner .btn-light").removeClass("active");
    }
    else {
      $(".home-banner .btn-light").addClass("active");
      $(".home-banner .btn-dark").removeClass("active");
    }


  }

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

  benefitsSlideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    prevArrow: false,
    nextArrow: false,
    fade: true,
    speed: 1,
    infinite: true,
    cssEase: 'ease-in-out',

  };


  companiesslide = {
    slidesToShow: 5,
    slidesToScroll: 5,
    dots: false,
    prevArrow: '<button class="slick-prev"></button>',
    nextArrow: '<button class="slick-next"></button>',
    centerMode: true,
    centerPadding: '150px',
    mouseWheel: false,
    autoplay: true,

  };


  testimonialslide = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    prevArrow: false,
    nextArrow: false,
    centerMode: true,
    centerPadding: '0',
    autoplay: true,
  };


  slickInit(e: any) {
    // console.log('slick initialized');
  }

  breakpoint(e: any) {
    // console.log('breakpoint');
  }



  benefitsOnScroll() {
    // let benefitsElement = document.getElementById("benefitsElement");

    // benefitsElement!.addEventListener('wheel', (event: any) => {
    //   benefitsElement!.addEventListener('wheel', this.preventDefault, {passive: false});
    //   if (event.deltaY > 0) {
    //     this.slickModal2.slickNext();
    //     if (benefitsElement != null) {        
    //       benefitsElement.classList.add('rotation');
    //     }

    //   } else if (event.deltaY < 0) {
    //     this.slickModal2.slickPrev();
    //     if (benefitsElement != null) {        
    //       benefitsElement.classList.remove('rotation');
    //     }

    //   }   
    // });

    let benefitsElement = document.getElementById("benefitsElement");
    benefitsElement!.addEventListener('wheel', (event: any) => {
      let currentIndex = this.slickModal2.currentIndex;

      if (event.deltaY > 0) {
        if (currentIndex != 1) {
          // console.log("inc", currentIndex)
          benefitsElement!.addEventListener('wheel', this.preventDefault, { passive: false });
        } else {
          benefitsElement!.removeEventListener('wheel', this.preventDefault);
        }
        if (currentIndex < 1) {
          this.slickModal2.slickNext();
        }
      } else if (event.deltaY < 0) {
        if (currentIndex != 0) {
          // console.log("dec", currentIndex)
          benefitsElement!.addEventListener('wheel', this.preventDefault, { passive: false });
        } else {
          benefitsElement!.removeEventListener('wheel', this.preventDefault);
        }
        if (currentIndex > 0) {
          this.slickModal2.slickPrev();
        }
      }
    });
  }
  solutionOnScroll() {

    // let solutionElement = document.getElementById("solutionElement");

    // solutionElement!.addEventListener('wheel', (event: any) => {
    //   solutionElement!.addEventListener('wheel', this.preventDefault, {passive: false});
    //   if (event.deltaY > 0) {
    //     this.slickModal1.slickNext();
    //   } else if (event.deltaY < 0) {
    //     this.slickModal1.slickPrev();
    //   }   
    // });


    let solutionElement = document.getElementById("solutionElement");
    solutionElement!.addEventListener('wheel', (event: any) => {
      let currentIndex = this.slickModal1.currentIndex;

      if (event.deltaY > 0) {
        if (currentIndex != 2) {
          // console.log("inc", currentIndex)
          solutionElement!.addEventListener('wheel', this.preventDefault, { passive: false });
        } else {
          solutionElement!.removeEventListener('wheel', this.preventDefault);
        }
        if (currentIndex < 2) {
          this.slickModal1.slickNext();
        }
      } else if (event.deltaY < 0) {
        if (currentIndex != 0) {
          // console.log("dec", currentIndex)
          solutionElement!.addEventListener('wheel', this.preventDefault, { passive: false });
        } else {
          solutionElement!.removeEventListener('wheel', this.preventDefault);
        }
        if (currentIndex > 0) {
          this.slickModal1.slickPrev();
        }
      }
    });
  }
  createGlobe(): void {

    const earthImg = assetUrl('earth-dark.jpg');
    const markerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 30" fill="none">
    <path fill="currentColor" d="M8 3.77796C8 1.78467 9.435 0.164062 11.2 0.164062H28.8C30.565 0.164062 32 1.78467 32 3.77796V20.0405C32 22.0338 30.565 23.6544 28.8 23.6544H16.84C16.25 22.2145 15.345 20.9722 14.22 20.0405H19.2V18.2335C19.2 17.2341 19.915 16.4266 20.8 16.4266H24C24.885 16.4266 25.6 17.2341 25.6 18.2335V20.0405H28.8V3.77796H11.2V6.55049C10.26 5.935 9.165 5.5849 8 5.5849V3.77796ZM8 7.39185C8.63035 7.39185 9.25452 7.53206 9.83688 7.80449C10.4192 8.07691 10.9484 8.4762 11.3941 8.97958C11.8398 9.48295 12.1934 10.0805 12.4346 10.7382C12.6758 11.3959 12.8 12.1008 12.8 12.8127C12.8 13.5246 12.6758 14.2295 12.4346 14.8872C12.1934 15.5448 11.8398 16.1424 11.3941 16.6458C10.9484 17.1492 10.4192 17.5485 9.83688 17.8209C9.25452 18.0933 8.63035 18.2335 8 18.2335C7.36966 18.2335 6.74548 18.0933 6.16312 17.8209C5.58076 17.5485 5.05161 17.1492 4.60589 16.6458C4.16017 16.1424 3.8066 15.5448 3.56538 14.8872C3.32416 14.2295 3.2 13.5246 3.2 12.8127C3.2 12.1008 3.32416 11.3959 3.56538 10.7382C3.8066 10.0805 4.16017 9.48295 4.60589 8.97958C5.05161 8.4762 5.58076 8.07691 6.16312 7.80449C6.74548 7.53206 7.36966 7.39185 8 7.39185ZM6.665 20.0405H9.33C13.015 20.0405 16 23.4116 16 27.5675C16 28.3976 15.405 29.0752 14.665 29.0752H1.335C0.595 29.0752 0 28.4032 0 27.5675C0 23.4116 2.985 20.0405 6.665 20.0405Z" fill="white"/>
    </svg>`;
    // console.log(earthImg, markerSvg);
    this.world = Globe()
      .width(1200).height(1200).backgroundColor("#fff0")
      .globeImageUrl(earthImg)
      .htmlElementsData(this.gData)
      .htmlElement((d: any) => {
        const el = document.createElement('div');
        el.innerHTML = "<div id='" + d.id + "' style='visibility: hidden'>" + d.popupHtml + "</div>" + markerSvg;
        el.style.color = d.color;
        el.style.width = `${d.size}px`;
        el.style.pointerEvents = 'auto';
        el.style.cursor = 'pointer';
        el.onclick = () => { this.clickOnMarker(d) };
        return el;
      })
      .hexPolygonsData(this.countryData.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.5)
      // .hexPolygonUseDots(true)
      .hexPolygonColor(() => "#57e1ff")
      // .hexPolygonLabel(({ properties: d }) => `
      //   <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
      //   Population: <i>${d.POP_EST}</i>
      // `)

      (document.getElementById("globeViz")!);
    this.world.controls().autoRotate = true;
    this.world.controls().autoRotateSpeed = 0.4;
    this.world.controls().enableZoom = false;
  }

  clickOnMarker(d: any): any {
    this.gData.forEach((element: any) => {
      let elem = document.getElementById(element.id);
      if (elem) {
        if (element.id == d.id) {
          elem!.style.visibility = "visible";
        } else {
          elem!.style.visibility = "hidden";
        }
      }
    });
  }

  private focusOnCountry(): void {
    if (this.world) {
      // Set the initial camera position to focus on the country
      this.world.pointOfView({ lat: 39.916668, lng: 116.38333 }, 300);
    }
  }
  ngAfterViewInit() {
    this.createGlobe();
    this.focusOnCountry();
    this.clientInfo();
  }

  async ngOnInit(): Promise<void> {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.solutionOnScroll();
    this.benefitsOnScroll();
    $(".home-banner .btn-dark").addClass("active");
    this.startInterval();

  }

  async receiveDataFromChild(userType: any) {
    console.log(userType);
    this.closeModal();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if (this.userLoggedIn) {
      if (userType == "CAND") {
        this.router.navigate(['/candidate/candidate-dashboard']);
      } else {
        this.router.navigate(['/employee/employee-dashboard']);
      }
    }


  }

  clientInfo(): void {
    setTimeout(() => {
      this.intervalClient = setInterval(() => {
        var elements: any[] = [];
        this.gData.forEach((element: any) => {
          let elem = document.getElementById(element.id);
          if (elem) {
            elem!.style.visibility = "hidden";
            elements.push(element.id);
          }
        });
        const randomIndex = Math.floor(Math.random() * elements.length);
        let elemVisible = document.getElementById(elements[randomIndex]);
        elemVisible!.style.visibility = "visible";

        // console.log(randomIndex, elements);

        elements = [];

      }, 2000);
    }, 1000);

  }

  startInterval(): void {
    this.intervalId = setInterval(() => {

      if (this.isShow == true) {
        this.isShow = false;
        $(".home-banner .btn-light").addClass("active");
        $(".home-banner .btn-dark").removeClass("active");

      }
      else {
        this.isShow = true;
        $(".home-banner .btn-dark").addClass("active");
        $(".home-banner .btn-light").removeClass("active");

      }

    }, 3000);
  }

  stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.intervalClient) {
      clearInterval(this.intervalClient);
      this.intervalClient = null;
    }
  }

  openGetReferral() {

    if (this.userLoggedIn) {
      // alert("User is Logged In")
      this.redirectToCompanyListing();
    } else {
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
  }

  // intervalId: any;

  // startInterval() {
  //   // Set your desired interval function
  //   this.intervalId = setInterval(() => {
  //     if(this.isShow == true){
  //       this.isShow = false;
  //       $(".home-banner .btn-light").addClass("active");
  //       $(".home-banner .btn-dark").removeClass("active");

  //     }
  //     else{
  //       this.isShow = true; 
  //       $(".home-banner .btn-dark").addClass("active");
  //       $(".home-banner .btn-light").removeClass("active");

  //     }
  //   }, 2000); // Change the interval duration as needed
  // }

  // stopInterval() {
  //   // Stop the interval when hovering in
  //   clearInterval(this.intervalId);
  // }

  // ngOnDestroy() {
  //   // Make sure to clear the interval when the component is destroyed
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId);
  //   }
  // }

  ngOnDestroy(): void {
    // Ensure to stop the interval when the component is destroyed
    this.stopInterval();
  }

  async redirectToCompanyListing() {
    this.router.navigateByUrl('/company-listing');
  }

  async openLogin() {
    if (this.userLoggedIn) {
      alert("User is Logged In")
    } else {
      this.openModal(ModalType.LOGIN_SIGNUP);
    }

  }
  async logout(): Promise<void> {
    await this.cognitoService.handleSignOut();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
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

}
