// --- QuebecModel.js: Defines the data structure for our Quebec records ---

// This class represents a single record in our Quebec collection.
// It defines the properties that each record will have and initializes them in the constructor.
class QuebecModel {
    constructor(name, repo, app, img) {
        this.name = name;
        this.repo = repo;
        this.app = app;
        this.img = img;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
// We export the QuebecModel class so it can be imported and used in our controller to create new records.
export default QuebecModel;
