export class UserService {
  private readonly token: string;

  constructor(token: string) {
    if (!token) {
      throw new Error('Sorry');
    }

    this.token = token;
  }

  async verifyUser() {
    console.log('Token:', this.token);

    return Promise.resolve({
      usn: 1234,
      name: 'Oliver',
    });
  }
}
