const GET_COLLECTION = {
  companyRole: 'roles',
  appRole: 'roles',
  userId: 'users',
  companyId: 'companies',
  petId: 'pets',
  ownerId: 'users',
  facility: 'facilities',
  physician: 'users'
};

export function makeLookUp(field, rename_data = false) {
  return {
    $lookup: {
      from: GET_COLLECTION[field],
      localField: field,
      foreignField: '_id',
      as: rename_data ? `${field}_data` : field
    }
  };
}

export function createMatch(companyId, filters) {
  return {
    $match: {
      $expr: {
        $eq: ['$companyId', { $toObjectId: companyId }]
      },
      ...filters
    }
  };
}

export function createGroup(localField) {
  return {
    $group: {
      _id: `$${localField}`,
      user: { $first: { $first: `$${localField}_data` } },
      data: { $push: '$$ROOT' }
    }
  };
}

export function deleteField(object, fieldToDelete) {
  const asArray = Object.entries(object);
  const filter = asArray.filter(([key, value]) => key !== fieldToDelete);
  return Object.fromEntries(filter);
}

export function createFilterMatch(object, company) {
  let keyFilters = Object.keys(object).filter((key) => key.includes('.'));
  let lookups = [];
  let filters = {};
  keyFilters.forEach((key) => {
    const splitKey = key.split('.');
    lookups.push(makeLookUp(splitKey[0]));
    filters[key] = object[key];
  });

  return [...lookups, createMatch(company, filters)];
}

export function createGroupByUserFilter(object) {
  return [
    makeLookUp(object['localField'], true),
    createGroup(object['localField'])
  ];
}
