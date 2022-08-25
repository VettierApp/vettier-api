module.exports.Builder = {
  user: (arrayNumber) => {
    const users = [
      {
        firstName: 'Jest',
        lastName: 'Testing',
        email: 'jesttesting@vetapp.com',
        password: 'secretPassword123',
        npi: 12345678903
      },
      {
        firstName: 'Second',
        lastName: 'Testing',
        email: 'secondJestTest@vetapp.com',
        password: 'secretPassword123',
        npi: 34534534
      },
      {
        firstName: 'Third',
        lastName: 'Testing',
        email: 'thirdJestTest@vetapp.com',
        password: 'secretPassword123',
        npi: 1234567890
      },
      {
        firstName: 'Another II',
        lastName: 'Testing II',
        email: 'anotherTestingII@vetapp.com',
        password: 'secretPassword123',
        npi: 12345678911
      },
      {
        firstName: 'Another III',
        lastName: 'Testing III',
        email: 'anotherTestingIII@vetapp.com',
        password: 'secretPassword123',
        npi: 12345678915
      },
      {
        firstName: 'Another VI',
        lastName: 'Testing VI',
        email: 'anotherTestingVI@vetapp.com',
        password: 'secretPassword123',
        npi: 12345678916
      },
      {
        firstName: 'Another V',
        lastName: 'Testing V',
        email: 'anotherTestingV@vetapp.com',
        password: 'secretPassword123',
        npi: 12345678917
      }
    ];
    return arrayNumber ? users[arrayNumber - 1] : users;
  },
  missingUser: () => ({
    firstName: 'Jest',
    lastName: 'Testing',
    password: 'secretPassword123',
    rolePosition: 'client',
    npi: 1234567890
  }),
  userSignIn: () => ({
    email: 'jesttesting@vetapp.com',
    password: 'secretPassword123'
  }),
  createGlobalRoles: (kindRole) => {
    const roles = {
      admin: {
        roleName: 'admin',
        permissionLevel: ['all']
      },
      owner: {
        roleName: 'owner',
        permissionLevel: ['all']
      },
      client: {
        roleName: 'client',
        permissionLevel: ['read', 'write']
      },
      physician: {
        roleName: 'physician',
        permissionLevel: ['read', 'write', 'update']
      },
      auxiliar: {
        roleName: 'auxiliar',
        permissionLevel: ['read', 'write']
      },
      employee: {
        roleName: 'employee',
        permissionLevel: ['write', 'read']
      }
    };
    return roles[kindRole];
  },
  admin: () => ({
    firstName: 'Jest Admin',
    lastName: 'Testing',
    email: 'adming@vetapp.com',
    password: 'secretPassword123',
    status: 'active',
    npi: 19827398
  }),
  adminSignin: () => ({
    email: 'adming@vetapp.com',
    password: 'secretPassword123'
  }),
  wrongChangePassword: () => ({
    lastPassword: 'secretPassword12',
    newPassword: 'myPassword123!'
  }),
  correctChangePassword: () => ({
    lastPassword: 'secretPassword123',
    newPassword: 'myPassword123!'
  }),
  newCompany: () => ({
    name: 'My First Pet Company',
    invoiceFrom: 1,
    invoiceTo: 1000,
    idNumber: 234234234,
    invoicePrefix: 'mfpc',
    email: 'info@myfirstcompany.com',
    valuePremiumPaid: 180000,
    typeId: 'nit',
    premiumDate: new Date(),
    status: true
  }),
  createPets: (kind) => {
    const pets = {
      dog: {
        name: 'Vera',
        dateOfBirth: '02/02/2021',
        breed: 'Samoyedo',
        species: 'canine',
        gender: 'female'
      },
      dogDuplicate: {
        name: 'Vera',
        dateOfBirth: '02/02/2021',
        breed: 'Samoyedo',
        species: 'canine',
        gender: 'female'
      },
      cat: {
        name: 'Stuart',
        dateOfBirth: '07/02/2015',
        breed: 'Half-Breed',
        species: 'feline',
        gender: 'male'
      },
      adminDog: {
        name: 'Romeo',
        dateOfBirth: '02/02/2021',
        breed: 'Samoyedo',
        species: 'canine',
        gender: 'female'
      }
    };
    return pets[kind];
  },
  createProduct: ({
    name,
    costValue,
    reference,
    stock,
    description,
    price
  }) => ({
    name,
    costValue,
    reference,
    stock,
    description,
    price
  }),

  request: () => ({
    requestDate: '2020-01-01',
    requestTime: '10:49'
  }),
  clinic: () => ({
    clinicalRecordTicket: '123213',
    diet: 'diet 1',
    illnesses: ['ill 1', 'ill 2'],
    surgeries: 'surgery one',
    inquiryReason: 'reason 1',
    sterilized: true,
    birth: '1990-01-01',
    animalBehavior: 'good',
    temperature: 13,
    pulse: 12,
    corporalCondition: 'good'
  }),
  pet: () => ({
    name: 'Doggy Jhonny',
    dateOfBirth: '1990-02-25',
    breed: 'Pincher',
    species: 'canine',
    gender: 'male',
    vaccines: [
      {
        name: 'Malaria',
        date: '2020-01-01',
        description: "It's a vaccinate"
      }
    ]
  }),
  facility: () => ({
    name: 'Facility Test',
    address: 'Street 1234',
    phone: '123456',
    city: 'Sincelejo'
  }),
  followups: () => ({
    comment: 'All is good'
  }),
  vaccination: () => ({
    vaccinationDate: '07/02/2020',
    vaccinate: 'Malaria',
    laboratory: 'Lab 1',
    lot: 'B-1',
    followups: 'All good',
    nextVaccination: '11/02/2020'
  }),
  medicalAssistance: () => ({
    assistanceDate: '11/02/2020',
    motive: 'sick',
    details: 'detail 1',
    problems: 'problem 1',
    differencialDiagnosis: 'diagnosis 1',
    presumptiveDiagnosis: 'diagnosis 2',
    diagnosisPlan: 'plan 1',
    therapeuticPlan: 'plan 2',
    finalDiagnosis: 'diagnosis 3',
    tratements: 'treatment 1',
    nextControl: '02/05/2021',
    exams: ['exam 1', 'exam 2']
  }),
  formulation: () => ({
    formulationDate: '02/05/2021',
    amount: 150000,
    diagnosis: 'diagnosis 1',
    medicines: 'medicine 1'
  })
};
