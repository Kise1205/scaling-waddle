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

export default QuebecModel;
