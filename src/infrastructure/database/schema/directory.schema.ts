import Mongoose from 'mongoose'

interface IDirectoryModel extends Mongoose.Document {}

const directorySchema = new Mongoose.Schema({
        type: String,
        name: String,
        directory: String,
        files: [
            {
                file_id: String,
                file_name: String
            }
        ]
    },
    {
        strict: false,
        timestamps: { createdAt: 'created_at', updatedAt: false },
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
                return ret
            }
        }
    }
)

export const DirectoryRepoModel = Mongoose.model<IDirectoryModel>(
    'directory', directorySchema, 'directory'
)
