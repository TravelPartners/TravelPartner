'use strict';

function tagsMatch(tags1, tags2) {
    return tags1.map(x => (tags2.includes(x) ? 1 : 0)).reduce((x, y) => x+ y);
}

function userUserMatch(username, userModel) {
    return userModel
        .where('name').equals(username)
        .exec()
        .then(async (users) => {
            let results = [];
            let owner = users[0];
            let ownerTags = owner.tags;

            try {
                let all = await userModel.find().exec();

                for (let each of all) {
                    let count = tagsMatch(ownerTags, each.tags);
                    results.push({
                        name: each.name,
                        avatar: each.avatar,
                        url: '/profile/' + each.name,
                        rank: count,
                        prop: (count / ownerTags.length.toFixed(2)).toFixed(2)
                    });
                }

                return Promise.resolve(results);
            } catch(err) {
                return Promise.reject(err);
            }
        });
}

function userPlaceMatch(username, userModel, placeModel) {
    return userModel
        .where('name').equals(username)
        .exec()
        .then(async (users) => {
            let results = [];
            let owner = users[0];
            let ownerTags = owner.tags;

            try {
                let all = await placeModel.find().exec();

                for (let each of all) {
                    let count = tagsMatch(ownerTags, each.tags);
                    results.push({
                        name: each.name,
                        id: each._id,
                        url: '/p/'+ each.name + '-' + each._id,
                        rank: count,
                        prop: (count / ownerTags.length.toFixed(2)).toFixed(2)
                    });
                }

                return Promise.resolve(results);
            } catch(err) {
                return Promise.reject(err);
            }
        });
}


module.exports.tagsMatch = tagsMatch;
module.exports.userPlaceMatch = userPlaceMatch;
module.exports.userUserMatch = userUserMatch;
