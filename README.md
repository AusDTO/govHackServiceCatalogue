# Service Catalogue
This is an catalogue of government services. It is intended that this catalogue be used to assist in the development of tools and software to assist the public in discovering and accessing government services and information, however further alternative - perhaps unconsidered - uses are encouraged.

Currently the information is being edited directly as JSON text files. While it is expected the JSON text file representation will continue, tools to assist users in creating the information are being developed.

__Contributions are welcome through the usual github mechanisms including issues, forks and pull requests. We also welcome questions through github issues.__

#Caveats
The information contained in this service catalogue is under active development and should be considered [pre*alpha](https://en.wikipedia.org/wiki/Software_release_life_cycle#Pre*alpha).
>Pre*alpha refers to all activities performed during the software project before testing. These activities can include requirements analysis, software design, software development, and unit testing. In typical open source development, there are several types of pre*alpha versions. Milestone versions include specific sets of functions and are released as soon as the functionality is complete. https://en.wikipedia.org/wiki/Software_release_life_cycle#Pre*alpha

In addition to this the information is known to be incomplete and so is presented without warranty or guarantee of accuracy.


#Structure
The service catalogue is managed as a directed graph where nodes represent an aspect of service delivery which an organisation wants to represent and the edges represent the the relationship between those aspects.
Each node is one several __node classes__, these classes are extended as needed by each organisation. They are:
* Organisation
* Service
* Service Dimension (Abstract)
* Component (Abtsract)
* Channel (Abstract)

Each of these classes has a set of default attributes which are described in the attribute information. Definitions of an abstract class are completed through an organisation specific schema and can define further subclasses with additional attributes.

All nodes in the graph must be on a path which originate from the organisation node. This supports automation and abstract understanding of the graph structure.

##Attribute Information
The following attributes have been defined:
* type (Referring to a node_class)
* id (The identifier)
* name
* acronym
* tagline (A short few-words description)
* description
* infoUrl (A url to an internet resource which contains information about the node)
* resourceUrl (A url to an internet resource which contains - or has further links to - data about the node)
* policyUrl (A url to an internet resource which contains policy information about the node)
* topics *
  * About Australia,
  * About government,
  * Benefits and payments,
  * Business and industry,
  * Education and training,
  * Emergencies and disasters,
  * Environment and science,
  * Family and community,
  * Health,
  * Immigration and visas,
  * IT and communications,
  * Jobs and workplace,
  * Money and tax,
  * Passports and travel,
  * Public safety and law,
  * Transport
- categories *
  * Registration or renewal,
  * Claims or benefits,
  * Reporting or lodgement,
  * Frontline support,
  * Search and information,
  * Events and bookings,
  * Support tools,
* lifeEvents *
  * I am employing someone for the first time,
  * I am getting divorced,
  * I am having a baby,
  * I am leaving school and wondering what next,
  * I am moving house,
  * I am retiring,
  * I am travelling overseas,
  * I have been diagnosed with a chronic illness,
  * I have lost my job,
  * I want to become an independent contractor,
  * I want to close down my business,
  * I want to grow my business,
  * I want to start a business,
  * I want to study (Australian Citizens)
  * I want to study in Australia (from overseas),
  * My child is starting school,
  * Someone has died,
  * Starting a business,
  * Running a business,
  * Growing a business,
  * Closing a business
* tags (A list of tags related to the node)
* DTOtags (List of additional tags related to the node managed by the DTO )
* incidental (Boolean value indicating if the node is incidental (occurs as a matter of course) of another node, meaning it is probably not a node users will be interested in )
* nonuser (Boolean value indicating if the node does NOT relate to users)
* todo - (Text description of incomplete tasks for maintaining the node)
* comment (Text comments for management/understanding of the node)
* primaryAudienceType (The primary audience of the node)
* targetedAgeRange (The targeted age range of the node)

\* Restricted to one or more of the listed values

# Interim Data Rules
These are interim rules and may be revisited based on user testing,  UI implementation considerations or other feedback.

##Inherited Attributes
Any attribute which can be related to a service can also be related to a service dimension.
Where an attribute is related to a service dimension, except where it is an array *(see below for arrays)*
it is implicitly applied to all the decendants of that service dimension node until a new
value is defined at which point the new value is used.

Where an attribute is an array of values it is still implicitly implied to all decendants but any additional values on decendant nodes are concatenated.
