import { MatPaginator } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";

export class Pagination {
  API_EVENT = {
    defaultLimit: 100,
    delete: 3,
    active: "UN_BLOCKED",
    inactive: "BLOCKED",
    block: "BLOCKED",
    DELETED: "DELETED",
    pending: "PENDING",
    success: "SUCCESS",
    expire: "EXPIRED",
    cancel: "CANCELED",
    Delivered: "DELIVERED",
    given: "GIVEN",
    none: "NONE",
    accept: "ACCEPTED",
    reject: "REJECTED",
    request: "REQUESTED",
    paymentFailed: "paymentFailed",
    pendingApproval: "PENDING_APPROVAL",
    scheduled: "SCHEDULED",
    ongoing: "ONGOING",
    approve: "APPROVED",
    bidAgain:"BIDAGAIN",
    completed: "COMPLETED",
    low: "LOW",
    medium: "MEDIUM",
    high: "HIGH",
    ban: "BAN",
    unBan: "UN_BAN",
    BOTH: "BOTH",
    MALE: "MALE",
    FEMALE: "FEMALE",
    TYPE_1: "TYPE_1",
    TYPE_2: "TYPE_2",
    TYPE_3: "TYPE_3",
    TYPE_4: "TYPE_4",
    paid:'paid',
    refunded:'refunded',
    failed:'failed',
    initialPayment:'INITIAL_PAYMENT',
    recurringPayment:'RECCURING_PAYMENT',
    GIVEN_PRO:'PRO_BY_ADMIN',
    PRO: 'PRO_USER',
  };
  today: Date = new Date();
  total: number = 0;
  nextHit: number = 0;
  pageNo: number;
  limit: number;
  search!: string;
  pageOptions: number[];
  filterOptions!: { [key: string]: string | any };
  sortOrder: number = -1;
  sortBy: string = "created";
  type!: string;
  statusType!: string;
  permissionClass: string = "";

  constructor() {
    this.total = 0;
    this.pageNo = 1;
    this.limit = 10;
    this.pageOptions = [5, 10, 25, 100];
  }

  get pageParams() {
    return {
      pageNo: this.pageNo,
      limit: this.limit,
    };
  }

  get searchFilter() {
    return { searchKey: this.search };
  }

  get sortHeaders() {
    return {
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    };
  }

  get typeOf() {
    return {
      type: this.type,
      status: this.statusType,
    };
  }

  confirmPageReload() {}

  allPrams() {
    return {
      ...this.typeOf,
      ...this.pageParams,
      ...this.filterOptions,
      ...this.searchFilter,
      ...this.sortHeaders,
    };
  }

  normalPrams() {
    return {
      ...this.pageParams,
      ...this.filterOptions,
      ...this.searchFilter,
    };
  }
  pagePrams() {
    return {
      ...this.pageParams,
    };
  }

  /**
   * @description This function checks if page needs to be decreased on row deletion
   */
  validateDeletion() {
    if (this.total !== 1 && this.total - (this.pageNo - 1) * this.limit === 1) {
      this.pageNo--;
      this.total--;
    }
  }

  get validPageOptions() {
    const dataObj = this.allPrams();
    const mainOption = {};
    for (const i of Object.keys(dataObj)) {
      if (dataObj[i] || dataObj[i] === 0) {
        mainOption[i] = dataObj[i];
      }
    }
    return mainOption;
  }

  get params() {
    const dataObj = this.normalPrams();
    const mainOption = {};
    for (const i of Object.keys(dataObj)) {
      if (dataObj[i] || dataObj[i] === 0) {
        mainOption[i] = dataObj[i];
      }
    }
    return mainOption;
  }
  get onlyPageParams() {
    const dataObj = this.pagePrams();
    const mainOption = {};
    for (const i of Object.keys(dataObj)) {
      if (dataObj[i] || dataObj[i] === 0) {
        mainOption[i] = dataObj[i];
      }
    }
    return mainOption;
  }
  set pageOptionsOnChange(options: MatPaginator | any) {
    this.pageNo = options.pageIndex + 1;
    this.limit = options.pageSize;
  }

  set sortOptions(sortOption: Sort) {
    if (sortOption.direction) {
      this.sortBy= sortOption.active;
      this.sortOrder = sortOption.direction === "asc" ? 1 : 0;
    } else {
      this.sortBy = null;
      this.sortOrder = null;
    }
  }

  currentIndex(index: number): number {
    return (this.pageNo - 1) * this.limit + index + 1;
  }

  resetPages() {
    this.pageNo = 1;
    this.nextHit = 0;
  }
}
