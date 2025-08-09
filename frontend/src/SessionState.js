export const Session = {
    currentUser: null,
    set(user){
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    
    clear(){
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    },

    load(){
        const stored = localStorage.getItem('user');
        if (stored){
            this.currentUser = JSON.parse(stored);
        }
    }
};

// Load the session state when the application starts
Session.load();