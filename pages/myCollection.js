import MyCollectionUnconnected from '../components/MyCollectionUnconnected';
import MintBanner from '../components/MintBanner';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default function MyCollection() {
    return (
        <div>
            <div className='mt-10'>
                <MintBanner />
            </div>
            <div className='mt-10'>
                <Tabs>
                    <TabList>
                        <Tab>Story</Tab>
                        <Tab>Calendar</Tab>
                    </TabList>

                    <TabPanel>
                        <h2>Any content 1</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>Any content 2</h2>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    )
}
