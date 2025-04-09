import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ABOUT_US_CUSTOMER_PUBLIC, FAQS_CUSTOMER_PUBLIC, PRIVACY_POLICY_CUSTOMER_PUBLIC, TERMS_CONDITIONS_CUSTOMER_PUBLIC} from '../../constants/routes';
import { Subscription } from 'rxjs';
import { CmsService } from '../../features/cms/service/cms.service';
import { COMMON_KEYS, CONTENT_TYPES } from '../../constants/constant';
import { ApiResponse, IFaqs, IStaticContent } from '../../constants/interface';
import { SafePipe } from '../../pipes/safe/safe.pipe';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { STRING_CONST } from '../../constants/string';
import { DataLoaderComponent } from '../data-loader/data-loader.component';
import { CommonService } from '../../services/common/common.service';
import { FormsModule } from '@angular/forms';

const MODULES = [
  SafePipe,
  MatExpansionModule,
  DataLoaderComponent,
  FormsModule
]

@Component({
  selector: 'app-public-cms',
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: './public-cms.component.html',
  styleUrl: './public-cms.component.scss'
})
export class PublicCmsComponent {

  contentData: IStaticContent;
  subscriptions: Subscription[] = [];
  isFaq: boolean = false;
  faqList: Array<IFaqs> = [];
  stringConst = STRING_CONST;
  apiHit = false;
  public modules = {
    formula: false,
    toolbar: false,
  };
  constructor(private _actRoute: ActivatedRoute, private _cms: CmsService,
    private _common: CommonService,
    private _router: Router) { }

  ngOnInit() {
    const pageFor = this._actRoute.snapshot.params[COMMON_KEYS.CMS_PAGE] || '';
    if (pageFor) {
      this.getStaticContentData(pageFor);
    } else {
      this._router.navigate(['404']);
    }
  }


  getStaticContentData(pageFor: string,) {
    switch (pageFor) {
      case PRIVACY_POLICY_CUSTOMER_PUBLIC.path: this.getContentByLanguage(CONTENT_TYPES.PRIVACY_POLICY); break;
      case TERMS_CONDITIONS_CUSTOMER_PUBLIC.path: this.getContentByLanguage(CONTENT_TYPES.TERMS_CONDITIONS); break;
      case ABOUT_US_CUSTOMER_PUBLIC.path: this.getContentByLanguage(CONTENT_TYPES.ABOUT_US); break;
      case FAQS_CUSTOMER_PUBLIC.path: this.getFaqByLanguage(); break;

    }
  }

  getContentByLanguage(pageFor: string) {
    this.isFaq = false;
    this.apiHit = true;
    let params = {
      type: pageFor,
    }
    this.subscriptions.push(
      this._cms.getCmsContents(params).subscribe({
        next: (res: ApiResponse<IStaticContent>) => {
          this.apiHit = false;
          if (res && res.data) {
            this.contentData = res.data;
          }
        },
        error: (error) => { this.apiHit = false; }
      })
    );
  }

  getFaqByLanguage() {
    this.apiHit = true;
      this.isFaq = true;
      let params = {
        pageNo:1,
        limit:100
      }
      this.subscriptions.push(
        this._cms.getfaqList(params).subscribe({
          next: (res: ApiResponse<Array<IFaqs | null>>) => {
            this.apiHit = false;
            if (res && res.data) {
              this.faqList = res.data || [];
            }
          },
          error: (err: ApiResponse) => this.apiHit = false
        })
      )
    // }
  }

  /**
 * @UNSUBSCRIPTION Unsubscribe all subscriptions to avoid memory leak
 */
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this._common.unsubscribe(this.subscriptions);
    }
  }

}
