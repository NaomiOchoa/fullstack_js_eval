const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')
const moment = require('moment')


module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    try {
      const newPerson = await database('people')
        .insert(req.body)
        .returning('*')
      res
        .status(200)
        .json(newPerson[0])
    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    try {
      const foundPerson = await database('people')
        .where({id: req.params.personID})
      if (!foundPerson.length) {
        res.sendStatus(404)
      }
      else {
        res
          .status(200)
          .json(foundPerson[0])
      }
    } catch (error) {
      console.error(error)
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    try {
      const allPeople = await database('people')
      res
        .status(200)
        .json(allPeople)
    } catch (error) {
      console.error(error)
    }
  })

  /**
   * Do not modify beyond this point until you have reached
   * TDD / BDD Mocha.js / Chai.js
   * ======================================================
   * ======================================================
   */

  /**
   * POST /v1/people/:personID/addresses
   * Create a new address belonging to a person
   **/
  api.post('/:personID/addresses', async (req, res) => {
    try {
      const newAddress = await database('addresses')
      .insert({...req.body, person_id: req.params.personID})
      .returning('*')
    res
      .status(200)
      .json(newAddress[0])
    } catch (error) {
      console.error(error)
    }
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    try {
      const foundAddress = await database('addresses')
        .where({person_id: req.params.personID, id: req.params.addressID})
      if (!foundAddress.length) {
        res.sendStatus(404)
      }
      else {
        res
          .status(200)
          .json(foundAddress[0])
      }
    } catch (error) {
      console.error(error)
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    try {
      const allPersonsAddresses = await database('addresses')
        .where({person_id: req.params.personID})
      res
        .status(200)
        .json(allPersonsAddresses)
    } catch (error) {
      console.error(error)
    }
  })

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete('/:personID/addresses/:addressID', async (req, res) => {
    try {
      const deletedAddress = await database('addresses')
        .where({person_id: req.params.personID, id: req.params.addressID})
        .update({deleted_at: moment().toISOString()})
        .returning('*')
      res
        .status(200)
        .json(deletedAddress[0])
    } catch (error) {
      console.error(error)
    }
  })
}


