// INSTRUCTIONS:
/*
  Create a new resource controller that uses the
  User as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  The resource controller must contain the 7 resource actions:
  - index
  - show
  - new
  - create
  - edit
  - update
  - delete
*/

const viewPath = 'resources';
const Resource = require('../models/Resource');
const User = require('../models/User');

exports.index = async (req, res) => {
  try {
    const resources = await Resource
      .find()
      .populate('user')
      .sort({updatedAt: 'desc'});

    res.render(`${viewPath}/index`, {
      resources: resources
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying Notes: ${error}`);
    res.redirect('/');
  }
};

exports.show = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('user');
    console.log(Resource);
    res.render(`${viewPath}/show`, {
      resource: resource
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying Note : ${error}`);
    res.redirect('/');
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`);
};

exports.create = async (req, res) => {
  try {
    console.log(req.session.passport);
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    console.log('User', user);
    const resource = await Resource.create({user: user._id, ...req.body});

    req.flash('success', 'Note created successfully');
    res.redirect(`/resources/${resource.id}`);
  } catch (error) {
    req.flash('danger', `There was an error Creating new Note: ${error}`);
    req.session.formData = req.body;
    res.redirect('/resources/new');
  }
};

exports.edit = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      formData: resource
    });
  } catch (error) {
    req.flash('danger', `There was an error Editing The Note: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let resource = await Resource.findById(req.body.id);
    if (!resource) throw new Error('Note is not available');

    const attributes = {user: user._id, ...req.body};
    await Resource.validate(attributes);
    await Resource.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The Note was successfully updated');
    res.redirect(`/resources/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error Updating the Note: ${error}`);
    res.redirect(`/resources/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    console.log(req.body);
    await Resource.deleteOne({_id: req.body.id});
    req.flash('success', 'The Note was deleted successfully');
    res.redirect(`/resources`);
  } catch (error) {
    req.flash('danger', `There was an error deleting Note: ${error}`);
    res.redirect(`/resources`);
  }
};