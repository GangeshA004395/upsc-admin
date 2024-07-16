const asyncHandler = require("express-async-handler");

export const paginate =  async (
    model: any,
    page = 1,
    limit = 10,
    filters = { },
    order = null,
    fields = null,
    relation = null
  ) => {
    const offset = (page - 1) * limit;

    let options = {  } as any;
    if (filters) {
      options = filters;
    }
    if (order) {
      options.orderBy = order;
    }
    if (fields) {
      options.select = fields;
    }
    if (relation) {
      options.include = relation;
    }

    let totalCount = {};
    if (filters) {
      totalCount = filters;
    }
    
    const count = await model.count(totalCount);
   
    const results = await model.find(filters).skip(limit*(page-1)).limit(limit).toArray();
    return {
      total: count,
      data: results,
      currentPage: page,
      previousPage: page == 1 ? null : page - 1,
      nextPage: page * limit >= count ? null : page + 1,
      lastPage: Math.ceil(count / limit),
      countPerPage: limit,
    };
}