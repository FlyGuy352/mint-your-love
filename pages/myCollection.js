import MyCollectionUnconnected from '../components/MyCollectionUnconnected';
import MintBanner from '../components/MintBanner';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Calendar from '../components/Calendar';
import 'react-tabs/style/react-tabs.css';

export default function MyCollection() {
    return (
        <div>
            <div className='mt-10'>
                <MintBanner />
            </div>
            <div className='m-10'>
                <Tabs selectedTabClassName='text-crimsonRed font-bold selected-tab'>
                    <TabList>
                        <Tab>Story</Tab>
                        <Tab>Calendar</Tab>
                    </TabList>

                    <TabPanel>
                        Story
                    </TabPanel>
                    <TabPanel>
                        <Calendar />
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}
