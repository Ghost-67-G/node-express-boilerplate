// const XLSX = require('xlsx');
const ApiError = require('../../utils/ApiError');
const admin = require('../../config/firebase');
// const db = admin.database();
/**
 * Creates a new user with the provided body data.
 *
 * @param {Object} body - The data for creating the user.
 * @param {string} body.email - The email of the user.
 * @param {string} body.password - The password of the user.
 * @param {string} body.displayName - The display name of the user.
 * @param {string} body.username - The username of the user.
 * @param {string} body.tenantId - The ID of the tenant.
 * @param {string[]} body.roles - The roles of the user.
 * @param {Object} body.user_metadata - The user metadata.
 * @return {Promise<Object>} The created user.
 */
const createUser = async (body) => {
  try {
    const { email, password, displayName } = body;
    const user = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    const _user = await getUser(user.uid);
    return _user;
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      throw new Error(error.code);
    }
    throw new Error(error.message || 'Error creating user in Firebase');
  }
};
/**
 * Retrieves a user from Firebase.
 *
 * @param {string} uid - The unique identifier of the user.
 * @param {string} [tenantId=''] - The tenant ID of the user. Defaults to an empty string.
 * @return {Promise<User>} The user object retrieved from Firebase.
 * @throws {Error} Throws an error if there is an issue retrieving the user.
 */
const getUser = async (uid) => {
  try {
    const user = await admin.auth().getUser(uid);
    return user;
  } catch (error) {
    throw new Error('Error getting user from Firebase');
  }
};
/**
 * Retrieves a user from Firebase.
 *
 * @param {string} uid - The unique identifier of the user.
 * @param {string} [tenantId=''] - The tenant ID of the user. Defaults to an empty string.
 * @return {Promise<User>} The user object retrieved from Firebase.
 * @throws {Error} Throws an error if there is an issue retrieving the user.
 */
const getUserByEmail = async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    return user;
  } catch (error) {
    throw new ApiError(error.message || 'Error getting user from Firebase');
  }
};

/**
 * Updates a user in the database.
 *
 * @param {string} uid - The ID of the user.
 * @param {object} updatedData - The updated data for the user.
 * @param {string} tenantId - The ID of the tenant (optional).
 * @return {object} The updated user object.
 */
const updateUser = async (uid, updatedData) => {
  try {
    const update = await admin.auth().updateUser(uid, updatedData);
    return update;
  } catch (error) {
    throw new Error('Error updating user in Firebase');
  }
};
/**
 * Deletes a user from the database.
 *
 * @param {string} uid - The ID of the user to be deleted.
 * @param {string} tenantId - The ID of the tenant to which the user belongs.
 * @return {Promise<string>} A message indicating whether the user was successfully deleted.
 */
const deleteUser = async (uid, tenantId) => {
  try {
    await admin.auth().deleteUser(uid);
    return { uid, tenantId };
  } catch (error) {
    throw new Error(error.message || 'Error deleting user from Firebase');
  }
};

/**
 * Imports users from a file and adds them to the database.
 *
 * @param {Object} req - the request object with the uploaded file
 * @param {string} tenantId - the ID of the tenant the users belong to
 * @throws {Error} if the file is missing in the request body
 * @return {Promise} a promise that resolves to the created users
 */
const importUsers = async (usersData) => {
  const validationErrors = [];

  const authInstance = admin.auth();

  const importOptions = {
    hash: {
      algorithm: 'BCRYPT',
    },
  };

  const uniqueUsers = [];
  const emailSet = new Set();

  for (const user of usersData) {
    // Check if the email is unique within the array
    if (!emailSet.has(user.email)) {
      emailSet.add(user.email);

      try {
        await authInstance.getUserByEmail(user.email);
        validationErrors.push(user);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          // If the error is 'auth/user-not-found', the user is unique
          // Add the user to the uniqueUsers array
          uniqueUsers.push(user);
        } else {
          // If there's an unexpected error, log it and throw it
          console.error('Error checking for duplicate user:', error);
          throw error;
        }
      }
    } else {
      // If the email is not unique within the array, add to validationErrors
      validationErrors.push(user);
    }
  }

  const createdUsers = await authInstance.importUsers(uniqueUsers, importOptions);
  if (createdUsers.errors.length) {
    throw new Error(createdUsers.errors[0].error.message);
  }
  return { status: createdUsers, duplicates: validationErrors };
};

/**
 * Export users to an Excel file based on the specified tenant ID.
 *
 * @param {string} tenantId - The ID of the tenant.
 * @return {Object} An object containing the location of the exported file.
 */
// const exportUser = async (tenantId) => {
//   try {
//     let users = await User.find({ tenantId });
//     // users = users.map((s) => flattenObject(s._doc))
//     const fieldsToExport = [
//       'username',
//       'email',
//       'displayName',
//       'user_metadata.date',
//       'user_metadata.grade',
//       'user_metadata.gender',
//       'app_metadata.roles.0',
//       'app_metadata.roles.1',
//       'app_metadata.roles.2',
//       'user_id',
//     ];
//     users = users.map((user) => {
//       const flattenedUser = flattenObject(user.toObject());
//       const filteredUser = {};

//       fieldsToExport.forEach((field) => {
//         if (flattenedUser[field]) {
//           filteredUser[field] = flattenedUser[field];
//         }
//       });
//       filteredUser.firstname = filteredUser.displayName.split(' ')[0];
//       filteredUser.lastname = filteredUser.displayName.split(' ')[1];
//       filteredUser.grade = filteredUser['user_metadata.grade'];
//       filteredUser['app_metadata/role'] = filteredUser['app_metadata.roles.0'];

//       delete filteredUser.displayName;
//       delete filteredUser['user_metadata.grade'];
//       delete filteredUser['app_metadata.roles.0'];
//       return filteredUser;
//     });
//     console.log(users);
//     const path = `./public/${tenantId}.xlsx`;

//     const sheets = XLSX.utils.json_to_sheet(users, { dense: true });

//     // Create a new workbook and add the sheets
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, sheets, 'Users');

//     // Write the workbook to an XLSX file
//     XLSX.writeFile(wb, path);

//     console.log('XLSX file created successfully.');
//     return { location: path.split('/').pop() };
//   } catch (error) {
//     console.error('Error exporting users:', error);
//     return error;
//   }
// };
/**
 * Flattens a nested object into a single-level object.
 *
 * @param {object} obj - The object to be flattened.
 * @param {string} prefix - The prefix to be added to the keys of the flattened object.
 * @return {object} - The flattened object.
 */
// const flattenObject = (obj, prefix = '') => {
//   const flattened = {};

//   for (const key in obj) {
//     if (typeof obj[key] === 'object' && obj[key] !== null) {
//       Object.assign(flattened, flattenObject(obj[key], `${prefix}${key}.`));
//     } else {
//       flattened[`${prefix}${key}`] = obj[key];
//     }
//   }

//   return flattened;
// };

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  importUsers,
  // exportUser,
  getUserByEmail,
};
