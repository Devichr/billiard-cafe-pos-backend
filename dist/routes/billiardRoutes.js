"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBilliardRoutes = void 0;
const billiardController_1 = require("../controllers/billiardController");
const setBilliardRoutes = async (app, options) => {
    const { db } = options;
    const billiardController = new billiardController_1.BilliardController(db);
    app.post('/api/billiard/reservations', billiardController.createReservation.bind(billiardController));
    app.get('/api/billiard/reservations', billiardController.getReservations.bind(billiardController));
    app.get('/api/billiard/reservations/:id', billiardController.getReservationById.bind(billiardController));
    app.patch('/api/billiard/reservations/status', billiardController.updateReservationStatus.bind(billiardController));
    app.put('/api/billiard/reservations/:id', billiardController.updateReservation.bind(billiardController));
    app.delete('/api/billiard/reservations/:id', billiardController.deleteReservation.bind(billiardController));
    app.get('/api/billiard/tables/status', billiardController.getTableStatus.bind(billiardController));
};
exports.setBilliardRoutes = setBilliardRoutes;
//# sourceMappingURL=billiardRoutes.js.map