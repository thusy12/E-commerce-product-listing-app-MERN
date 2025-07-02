class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i" // case-insensitive
            }
        }: {};

        this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryStrCopy = {...this.queryStr};

        // Removing fields from query
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(field => delete queryStrCopy[field]);

        this.query.find(queryStrCopy);
        return this;
    }
}

module.exports = ApiFeatures;