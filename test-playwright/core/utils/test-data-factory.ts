import { faker } from '@faker-js/faker';

export interface TestUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export class TestDataFactory {
  static generateValidUser(): TestUser {
    return {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12, memorable: true }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
  }

  static generateInvalidUsers(): TestUser[] {
    return [
      {
        email: 'invalid-email',
        password: 'short',
      },
      {
        email: '',
        password: '',
      },
      {
        email: 'test@test.com',
        password: '123', // Too short
      },
      {
        email: 'test@test.com',
        password: 'password123', // Common password
      },
    ];
  }

  static generateRandomValidUsers(count: number = 5): TestUser[] {
    return Array.from({ length: count }, () => this.generateValidUser());
  }

  // Add more data generators as needed
  static generateValidLoginCredentials(): TestUser {
    return {
      email: 'yajay20001104@gmail.com',
      password: '12345678',
    };
  }

  static generateInvalidLoginCredentials(): TestUser[] {
    return [
      {
        email: 'nonexistent@example.com',
        password: 'WrongPassword123!',
      },
      {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      },
    ];
  }
}
