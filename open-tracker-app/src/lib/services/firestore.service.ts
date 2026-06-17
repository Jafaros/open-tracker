import { db } from '$lib/firebase';
import {
	collection,
	doc,
	getDocs,
	onSnapshot,
	type Unsubscribe,
} from 'firebase/firestore';
