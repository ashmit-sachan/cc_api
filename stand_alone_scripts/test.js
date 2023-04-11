// const params = { artist: 'fun.', year: '2012', title: 'Carry On'}
//
//
//
//
// const genExp = (exp, params) => {
//     const precedenceKeys = ["title", "artist", "year"];
//     for(let index=0; index < precedenceKeys.length; index++) {
//         if (params[precedenceKeys[index]]) {
//             exp.key = precedenceKeys[index];
//             exp.value = params[precedenceKeys[index]];
//
//             delete params[precedenceKeys[index]];
//             break;
//         }
//     }
//
//     if (Object.keys(params).length) {
//         exp.filter = {};
//         for (let param in params) {
//             exp.filter[param] = {};
//             exp.filter[param].condition = "=";
//             exp.filter[param].value = params[param];
//         }
//     }
//
//     console.log(exp)
// }
//
//
// genExp(exp,params);