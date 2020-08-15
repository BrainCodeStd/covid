const moment = require('moment')
export const formatDate = (date, format) => {
    return moment(new Date(date)).format(format ? format : "MMM Do YY, h:mm a");
};

export const formatDeliveryDate = (date, format) => {
    return moment(+date * 1000).format(format ? format : "DD-MM");
};