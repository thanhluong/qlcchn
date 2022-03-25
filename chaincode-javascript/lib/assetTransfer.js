'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class CertManager extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                ID: 'degree001',
                Owner: 'Ung Quang Thuan',
                University: 'YDS',
                Hospital: 'NA',
                IssuedDate: '2019-10-15',
            },
            {
                ID: 'degree002',
                Owner: 'Pham Bao Huy',
                University: 'HMU',
                Hospital: 'NA',
                IssuedDate: '2018-10-06',
            },
            {
                ID: 'degree003',
                Owner: 'Ung Nho Nha',
                University: 'YDS',
                Hospital: 'NA',
                IssuedDate: '2020-10-06',
            },
            {
                ID: 'degree004',
                Owner: 'Ung Nho Hieu',
                University: 'HMU',
                Hospital: 'NA',
                IssuedDate: '2021-10-06',
            },
            {
                ID: 'degree005',
                Owner: 'Dang Bao Khoa',
                University: 'YDH',
                Hospital: 'NA',
                IssuedDate: '2020-09-02',
            },
            {
                ID: 'degree006',
                Owner: 'Doan Nguyen Thanh Luong',
                University: 'YDS',
                Hospital: 'NA',
                IssuedDate: '2020-10-05',
            },
            {
                ID: 'intern001',
                Owner: 'Ung Nho Hieu',
                University: 'NA',
                Hospital: 'Da Khoa Quang Nam',
                IssuedDate: '2022-02-02'
            },
            {
                ID: 'intern002',
                Owner: 'Dang Bao Khoa',
                University: 'NA',
                Hospital: 'Cho Ray',
                IssuedDate: '2021-06-01'
            }
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
        }
    }

    // CreateDegree issues a new asset to the world state with given details.
    async CreateDegree(ctx, id, owner, university, issueddate) {
        const exists = await this.DegreeExists(ctx, id);
        if (exists) {
            throw new Error(`The degree ${id} already exists`);
        }
        id = 'degree' + id;

        const asset = {
            ID: id,
            Owner: owner,
            University: university,
            Hospital: 'NA',
            IssuedDate: issueddate,
        };
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    // ReadDegree returns the degree stored in the world state with given id.
    async ReadDegree(ctx, id) {
        id = 'degree' + id;
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The degree ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateDegree updates an existing degree in the world state with provided parameters.
    async UpdateDegree(ctx, id, owner, university, issueddate) {
        const exists = await this.DegreeExists(ctx, id);
        if (!exists) {
            throw new Error(`The degree ${id} does not exist`);
        }
        id = 'degree' + id;

        // overwriting original degree with new degree
        const updatedAsset = {
            ID: id,
            Owner: owner,
            University: university,
            Hospital: 'NA',
            IssuedDate: issueddate,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteDegree deletes an given degree from the world state.
    async DeleteDegree(ctx, id) {
        const exists = await this.DegreeExists(ctx, id);
        if (!exists) {
            throw new Error(`The degree ${id} does not exist`);
        }
        id = 'degree' + id;
        return ctx.stub.deleteState(id);
    }

    // DegreeExists returns true when asset with given ID exists in world state.
    async DegreeExists(ctx, id) {
        id = 'degree' + id;
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllDegrees(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    // CreateIntern issues a new asset to the world state with given details.
    async CreateIntern(ctx, id, owner, hospital, issueddate) {
        const exists = await this.InternExists(ctx, id);
        if (exists) {
            throw new Error(`The intern ${id} already exists`);
        }
        id = 'intern' + id;

        const asset = {
            ID: id,
            Owner: owner,
            University: 'NA',
            Hospital: hospital,
            IssuedDate: issueddate,
        };
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    // ReadIntern returns the intern stored in the world state with given id.
    async ReadIntern(ctx, id) {
        id = 'intern' + id;
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The intern ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateIntern updates an existing degree in the world state with provided parameters.
    async UpdateIntern(ctx, id, owner, hospital, issueddate) {
        const exists = await this.InternExists(ctx, id);
        if (!exists) {
            throw new Error(`The intern ${id} does not exist`);
        }
        id = 'intern' + id;

        // overwriting original intern with new degree
        const updatedAsset = {
            ID: id,
            Owner: owner,
            University: 'NA',
            Hospital: hospital,
            IssuedDate: issueddate,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteIntern deletes an given degree from the world state.
    async DeleteIntern(ctx, id) {
        const exists = await this.InternExists(ctx, id);
        if (!exists) {
            throw new Error(`The intern ${id} does not exist`);
        }
        id = 'intern' + id;
        return ctx.stub.deleteState(id);
    }

    // InternExists returns true when asset with given ID exists in world state.
    async InternExists(ctx, id) {
        id = 'intern' + id;
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // verify Occupational Certificate - Only for So Y Te
    async VerifyOC(ctx, degreeID, internID, owner) {        
        const degreeExists = await this.DegreeExists(ctx, degreeID);
        if (!degreeExists) {
            throw new Error(`The degree ${degreeID} does not exist`);
        }

        const internExists = await this.InternExists(ctx, internID);
        if (!internExists) {
            throw new Error(`The intern ${internID} does not exist`);
        }

        degreeID = 'degree' + degreeID;
        internID = 'intern' + internID;

        const degreeJSONStr = await ctx.stub.getState(degreeID);
        const internJSONStr = await ctx.stub.getState(internID);

        const degreeJSON = JSON.parse(degreeJSONStr.toString());
        const internJSON = JSON.parse(internJSONStr.toString());

        return (degreeJSON['Owner'] == owner) && (degreeJSON['Owner'] == internJSON['Owner']);        
    }
}

module.exports = CertManager;
