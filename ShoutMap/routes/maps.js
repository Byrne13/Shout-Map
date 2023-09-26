import {Router} from 'express';
const router = Router();


router.route('/').get(async (req, res) => {
  try {
    let isLoggedIn = true;
    if (!req.session.user) {
        isLoggedIn = false;
    }
    res.render('map', {isLoggedIn: isLoggedIn});
  } catch (e) {
    res.status(400).json({error: e});
  }
});

export default router;