export class LoadingHandler {
  isLoading = false;
  private timeout: any;

  //Am avut o incercare cu loading data indicator-ul

  start() {
    this.timeout = setTimeout(() => {
      this.isLoading = true;
    }, 1000);
  }

  finish() {
    this.isLoading = false;
    clearTimeout(this.timeout);
  }
}
